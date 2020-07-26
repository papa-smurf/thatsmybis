<?php

namespace App\Http\Controllers;

use App\{Guild, Member, Permission, Role, User};
use Auth;
use Exception;
use Illuminate\Http\Request;
use RestCord\DiscordClient;
// use Kodeine\Acl\Models\Eloquent\Permission;

class GuildController extends Controller
{
    const ADMIN_PERMISSIONS = 0x8;
    const MANAGEMENT_PERMISSIONS = 0x20;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(['auth', 'seeUser']);
    }

    /**
     * Show the guild registration.
     *
     * @return \Illuminate\Http\Response
     */
    public function showRegister()
    {
        return view('guild.register', []);
    }

    /**
     * Register a guild
     *
     * @return \Illuminate\Http\Response
     */
    public function register()
    {
        $validationRules =  [
            'name'       => 'string|max:36|unique:guilds,name',
            'discord_id' => 'string|max:255|unique:guilds,discord_id',
            'bot_added'  => 'numeric|gte:1',
        ];

        $this->validate(request(), $validationRules);

        $input = request()->all();
        $user = Auth::user();

        // Verify that the bot is on the server
        $discord = new DiscordClient(['token' => env('DISCORD_BOT_TOKEN')]);

        try {
            $discordMember = $discord->guild->getGuildMember(['guild.id' => (int)$input['discord_id'], 'user.id' => (int)$user->discord_id]);
        } catch (Exception $e) {
            abort(403, "Insufficient server privileges to register that guild.");
        }

        $hasPermissions = false;

        $roles = $discord->guild->getGuildRoles(['guild.id' => (int)$input['discord_id']]);

        // Go through each of the user's roles, and check to see if any of them have admin or management permissions
        // We're only going to let the user register this server if they have one of those permissions
        foreach ($discordMember->roles as $role) {
            $permissions = $roles[array_search($role, array_column($roles, 'id'))]->permissions;
            if (($permissions & self::ADMIN_PERMISSIONS) == self::ADMIN_PERMISSIONS) { // if we want to allow management permissions: || ($permissions & self::MANAGEMENT_PERMISSIONS) == self::MANAGEMENT_PERMISSIONS
                $hasPermissions = true;
                break;
            }
        }

        if (!$hasPermissions) {
            $error = \Illuminate\Validation\ValidationException::withMessages([
               'permissions' => ["We couldn't find admin permissions on your account for that server. Have someone with one of those permissions register your guild."],
            ]);
            throw $error;
        }

        // Create the guild
        $guild = Guild::firstOrCreate(['name' => $input['name']],
            [
                'slug'       => slug($input['name']),
                'user_id'    => $user->id,
                'discord_id' => $input['discord_id'],
            ]);

        // Insert the roles associated with this Discord
        foreach ($roles as $role) {
            $role = Role::firstOrCreate(['discord_id' => $role->id],
                [
                    'name'        => $role->name,
                    'guild_id'    => $guild->id,
                    'slug'        => slug($role->name),
                    'description' => null,
                    'color'       => $role->color ? $role->color : null,
                    'position'    => $role->position,
                    'permissions' => $role->permissions,
                ]);
        }

        $member = Member::create($user, $discordMember, $guild);

        // Redirect to guild settings page; prompting the user to finish setup
        request()->session()->flash('status', 'Successfully registered guild.');
        return redirect()->route('guild.settings', ['guildSlug' => $guild->slug]);
    }

    /**
     * Show the guild settings page.
     *
     * @return \Illuminate\Http\Response
     */
    public function settings($guildSlug)
    {
        $guild         = request()->get('guild');
        $currentMember = request()->get('currentMember');

        $guild->load(['roles']);

        // TODO: Validate can view settings page for this guild

        $permissions = Permission::all();

        return view('guild.settings', [
            'currentMember' => $currentMember,
            'guild'         => $guild,
            'permissions'   => $permissions,
        ]);
    }

    /**
     * Submit the guild settings page.
     *
     * @return \Illuminate\Http\Response
     */
    public function submitSettings($guildSlug)
    {
        $guild         = request()->get('guild');
        $currentMember = request()->get('currentMember');

        $guild->load('roles');

        // TODO: Validate user can update settings for this guild

        $validationRules =  [
            'name'                => 'string|max:36|unique:guilds,name,' . $guild->id,
            'calendar_link'       => 'nullable|string|max:255',
            'gm_role_id'          => 'nullable|integer|exists:roles,discord_id',
            'officer_role_id'     => 'nullable|integer|exists:roles,discord_id',
            'raid_leader_role_id' => 'nullable|integer|exists:roles,discord_id',
            'member_roles.*'      => 'nullable|integer|exists:roles,discord_id',
        ];

        $this->validate(request(), $validationRules);

        $permissions = Permission::all();

        $updateValues['name']            = request()->input('name');
        $updateValues['slug']            = slug(request()->input('name'));
        $updateValues['calendar_link']   = request()->input('calendar_link');

        if (request()->input('gm_role_id')) {
            // Let's make sure that role exists...
            $role = $guild->roles->where('discord_id', request()->input('gm_role_id'))->first();
            if ($role && $role->discord_id != $guild->gm_role_id) { // Don't bother if this role is already there; this will be duplicating the effort
                // Attach the appropriate permissions to that role!
                $rolePermissions = $permissions->whereIn('role_note', ['guild_master', 'officer', 'raid_leader']);
                $role->permissions()->sync($rolePermissions->keyBy('id')->keys()->toArray());
                $updateValues['gm_role_id'] = request()->input('gm_role_id');
            }
        } else {
            $updateValues['gm_role_id'] = null;
            if ($guild->gm_role_id) {
                // Not anymore you're not!
                // Strip this role of all it's ill-gotten permissions! Walk the plank, ya scurvy dog!
                $role = $guild->roles->where('discord_id', $guild->gm_role_id)->first();
                if ($role) {
                    $role->permissions()->detach();
                }
            }
        }

        // Copy of the GM code seen above
        if (request()->input('officer_role_id')) {
            $role = $guild->roles->where('discord_id', request()->input('officer_role_id'))->first();
            if ($role && $role->discord_id != $guild->officer_role_id) {
                $rolePermissions = $permissions->whereIn('role_note', ['officer', 'raid_leader']);
                $role->permissions()->sync($rolePermissions->keyBy('id')->keys()->toArray());
                $updateValues['officer_role_id'] = request()->input('officer_role_id');
            }
        } else {
            $updateValues['officer_role_id'] = null;
            if ($guild->officer_role_id) {
                $role = $guild->roles->where('discord_id', $guild->officer_role_id)->first();
                if ($role) {
                    $role->permissions()->detach();
                }
            }
        }

        // Copy of the GM code seen above
        if (request()->input('raid_leader_role_id')) {
            $role = $guild->roles->where('discord_id', request()->input('raid_leader_role_id'))->first();
            if ($role && $role->discord_id != $guild->raid_leader_role_id) { // Don't bother if this role is already there
                $rolePermissions = $permissions->whereIn('role_note', ['raid_leader']);
                $role->permissions()->sync($rolePermissions->keyBy('id')->keys()->toArray());
                $updateValues['raid_leader_role_id'] = request()->input('raid_leader_role_id');
            }
        } else {
            $updateValues['raid_leader_role_id'] = null;
            if ($guild->raid_leader_role_id) {
                $role = $guild->roles->where('discord_id', $guild->raid_leader_role_id)->first();
                if ($role) {
                    $role->permissions()->detach();
                }
            }
        }

        $updateValues['member_role_ids'] = implode(array_filter(request()->input('member_roles')), ",");

        $guild->update($updateValues);

        request()->session()->flash('status', 'Guild settings updated.');
        return redirect()->route('guild.settings', ['guildSlug' => $guild->slug]);
    }
}
