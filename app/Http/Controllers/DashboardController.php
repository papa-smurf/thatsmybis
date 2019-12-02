<?php

namespace App\Http\Controllers;

use App\{Content, Raid, Role, User};
use Auth;
use Illuminate\Http\Request;
use RestCord\DiscordClient;

class DashboardController extends Controller
{
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
     * Show the News page.
     *
     * @return \Illuminate\Http\Response
     */
    public function news()
    {
        $user = User::where('id', Auth::id())->with('roles')->first();

        $category = request()->input('category');

        if (!$category) {
            $userDiscordRoles = $user->roles->keyBy('discord_id')->keys();

            $userRaids = Raid::whereIn('discord_role_id', $userDiscordRoles)->get()->keyBy('id')->keys()->toArray();

            $content = Content::where('category', 'news')->orWhereIn('raid_id', $userRaids)->whereNull('removed_at')->with('user')->orderByDesc('created_at')->get();
        } else {
            $content = Content::where('category', $category)->whereNull('removed_at')->with('user')->orderByDesc('created_at')->get();
        }

        $raids = Raid::all();

        return view('news', [
            'category' => $category,
            'contents' => $content,
            'raids'    => Raid::all(),
        ]);
    }

    /**
     * Show the calendar page.
     *
     * @return \Illuminate\Http\Response
     */
    public function calendar()
    {
        return view('calendar');
    }

    /**
     * Show the calendar page.
     *
     * @return \Illuminate\Http\Response
     */
    public function calendarIframe()
    {
        $iframe = file_get_contents('https://calendar.google.com/calendar/embed?src=kb05a7c6hee4eb1b2dge8niro0%40group.calendar.google.com&ctz=America%2FNew_York');
        $iframe = str_replace('</head>','<link rel="stylesheet" href="http://' . $_SERVER['SERVER_NAME'] . '/css/googleCalendar.css" /></head>', $iframe);
        $iframe = str_replace('</title>','</title><base href="https://calendar.google.com/" />', $iframe);
        return $iframe;
    }

    /**
     * Show the roster page.
     *
     * @return \Illuminate\Http\Response
     */
    public function roster()
    {
        $roles = Role::all();
        $members = User::whereNull('banned_at')->with('roles')->orderBy('username')->get();
        return view('roster', [
            'members' => $members,
            'roles'   => $roles,
        ]);
    }
}
