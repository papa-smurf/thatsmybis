<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Arr;
use App\Item;
use App\GItem;

class AddGiveItALickPriorities extends Migration
{
    private $priorities = [
        "Shadow-Cloak of Dalaran > Shadow > Casters",
        "Royal Cloak of Arathi Kings > Melee dps",
        "Gilded Thorium Cloak > Feral tank > other tanks",
        "Shadowvine Cloak of Infusion > OS",
        "Drape of the Dark Reavers > Hunter, Melee dps, feral tank",
        "Farstrider Wildercloak > Melee",
        "Ruby Drape of the Mysticant > Warlock, Mage, Boomkin > Shadow, Elemental",
        "Stainless Cloak of the Pure Hearted > Healer",
        "Brute Cloak of the Ogre-Magi > Mage, Warlock, Boomkin, Elemental",
        "Cloak of the Pit Stalker > Melee Dps, Feral tank, Hunter",
        "Pit Lord's Satchel > Raid roll",
        "Masquerade Gown > Holy priest",
        "Robe of the Elder Scribes > Caster",
        "Chestguard of the Conniver > Feral, Rogue",
        "Stonebough Jerkin > Resto Druid > Resto Shaman",
        "Earthblood Chestguard > Resto Shaman",
        "Scaled Breastplate of Carnage > Hunter, Enhancement",
        "Breastplate of the Lightbinder > Holy pala",
        "Panzar'Thar Breastplate > Tank",
        "Glider's Foot-Wraps > Common Sense",
        "Boots of Foretelling > Mage, Elemental, Boomkin > Warlock, Shadow",
        "Ruby Slippers > Mage, Warlock, Boomkin, Shadow > Elemental",
        "Boots of the Incorrupt > Holy priest > Resto druid",
        "Boots of the Infernal Coven > Caster",
        "Glider's Boots > OS",
        "Edgewalker Longboots > Melee dps, Hunter, Feral tank",
        "Forestlord Striders > Resto Druid, Resto shaman > Holy pala",
        "Rapscallion Boots > Rogue, feral",
        "Glider's Sabatons > Common Sense",
        "Fiend Slayer Boots > Hunter, Enhancement, Ret",
        "Ferocious Swift-Kickers > Common Sense",
        "Windshear Boots > Elemental",
        "Glider's Greaves > Common Sense",
        "Boots of Valiance > Holy Pala",
        "Battlescar Boots > Tank",
        "Ironstriders of Urgency > Warrior DPS, Ret > Prot Warrior",
        "Spectral Band of Innervation > Caster",
        "Garona's Signet Ring > Rogue, Feral DPS, Hunter, Enhancement",
        "Ring of Recurrence > Boomkin, Elemental > Shadow, Warlock, Mage",
        "Mender's Heart-Ring > Holy priest, Resto Druid",
        "Shermanar Great-Ring > Tank",
        "Mithril Band of the Unscarred > Melee DPS",
        "Ring of a Thousand Marks > Melee dps, Hunter",
        "Jade Ring of the Everliving > Resto Shaman, Holy Pala",
        "Gloves of Saintly Blessings > Holy priest, Resto Druid",
        "Handwraps of Flowing Thought > Caster",
        "Soul-Eater's Handwraps > Elemental > Shadow, Warlock, Mage, Boomkin",
        "Gloves of Dexterous Manipulation > Feral, Rogue",
        "Mitts of the Treemender > Resto Druid > Resto shaman, holy pala",
        "Liar's Tongue Gloves > Feral tank > melee, hunter",
        "Gloves of Quickening > OS",
        "Gloves of Centering > Resto shaman > Holy pala",
        "Gauntlets of the Dragonslayer > Hunter,Enhancement, ret",
        "Gauntlets of Renewed Hope > Holy Pala",
        "Iron Gauntlets of the Maiden > Tank",
        "Gauntlets of Martial Perfection > DPS warrior",
        "Wicked Witch's Hat > Mage, Warlock, Boomkin > Shadow, Elemental",
        "Headdress of the High Potentate > Holy priest > healers",
        "Uni-Mind Headdress > Boomkin > Mage, Warlock, Elemental, Shadow",
        "Collar of Cho'gall > Shadow",
        "Cowl of Defiance > Rogue, Feral",
        "Malefic Mask of the Shadows > Feral tank > Rogue",
        "Cowl of Nature's Breath > Resto druid > healers",
        "Big Bad Wolf's Head > Elemental",
        "Steelspine Faceguard > OS",
        "Maulgar's Warhelm > OS",
        "Thundering Greathelm > OS",
        "Signet of Unshakable Faith > Holy priest, Resto druid",
        "Aran's Soothing Sapphire > Healer",
        "Jewel of Infinite Possibilities > Caster",
        "Talisman of Nightbane > Caster",
        "Karaborian Talisman > Caster",
        "Trial-Fire Trousers > Shadow, Boomkin",
        "Trial-Fire Trousers > Shadow, Boomkin",
        "Pantaloons of Repentance > Holy priest > healers",
        "Earthsoul Leggings > Resto druid > Healers",
        "Earthsoul Leggings > Resto druid > Healers",
        "Skulker's Greaves > Feral, Rogue, hunter, Enhancement",
        "Heart-Flame Leggings > Resto Shaman> Holy pala",
        "Rip-Flayer Leggings > OS",
        "Wrynn Dynasty Greaves > Tank",
        "Legplates of the Innocent > Holy pala",
        "Nathrezim Mindblade > Caster",
        "Big Bad Wolf's Paw > Hunter",
        "The Decapitator > Enhancement, Fury",
        "Shard of the Virtuous > Healer",
        "Fool's Bane > Enhancement, Fury",
        "Light's Justice > Healers",
        "Bloodmaw Magus-Blade > Mage, Warlock, Prot Pala (pff...)",
        "Worgen Claw Necklace > Melee, Hunter",
        "Brooch of Unquenchable Fury > Mage, Warlock, Boomkin > Shadow, Elemental",
        "Barbed Choker of Discipline > Tank",
        "Mithril Chain of Heroism > Melee dps",
        "Saberclaw Talisman > Feral tank > melee, hunter",
        "Shining Chain of the Afterworld > Holy priest, Resto druid",
        "Emberspur Talisman > Holy pala, Resto shaman",
        "Adornment of Stolen Souls > Mage, Warlock, Boomkin, Elemental > Shadow",
        "Teeth of Gruul > Healers",
        "Emerald Ripper > Hunter",
        "Malchazeen > Hunter",
        "King's Defender > Warrior tank > prot pala",
        "Spiteblade > Rogue, Fury",
        "Sunfury Bow of the Phoenix > Hunter",
        "Steelhawk Crossbow > Hunter",
        "Wolfslayer Sniper Rifle > Hunter",
        "Tirisfal Wand of Ascendancy > Caster",
        "Eredar Wand of Obliteration > Mage, Warlock > Shadow",
        "Idol of the Avian Heart > Resto druid",
        "Libram of Souls Redeemed > Holy Pala",
        "Totem of Healing Rains > Resto Shaman",
        "Triptych Shield of the Ancients > Holy pala, Resto shaman",
        "Dragonheart Flameshield > Elemental>Prot pala",
        "Shield of Impenetrable Darkness > Tank",
        "Aldori Legacy Defender > Tank",
        "Aegis of the Vindicator > Holy pala, Resto shaman",
        "Pauldrons of the Solace-Giver > Holy priest > Resto druid",
        "Mantle of the Mind Flayer > OS",
        "Forest Wind Shoulderpads > Resto Druid > Healers",
        "Bladed Shoulderpads of the Merciless > Enhancement > feral, Rogue, ret, warrior",
        "Beastmaw Pauldrons > OS",
        "Beastmaw Pauldrons > OS",
        "Beastmaw Pauldrons > OS",
        "Dragon-Quake Shoulderguards > Resto Shaman > Holy pala",
        "Pauldrons of the Justice-Seeker > Holy Pala",
        "Mantle of Abrahmis > Tank",
        "Xavian Stiletto > Rogue, Warrior",
        "Shuriken of Negation > Rogue, Warrior",
        "Moroes' Lucky Pocket Watch > Feral tank >Prot pala, Prot warrior",
        "Ribbon of Sacrifice > Holy pala, holy priest, Resto shaman",
        "Ribbon of Sacrifice > Holy pala, holy priest, Resto shaman",
        "The Lightning Capacitor > Elemental > casters",
        "Pendant of the Violet Eye > Arcane, healer",
        "Dragonspine Trophy > Melee dps, hunter",
        "Eye of Gruul > Healer",
        "Eye of Magtheridon > Shadow, Prot pala > caster",
        "Glaive of the Pit > Arms, Ret",
        "Staff of Infinite Mysteries > Boomkin > Casters",
        "Terestian's Stranglestaff > Feral",
        "Nightstaff of the Everliving > Holy priest, Resto druid",
        "Crystalheart Pulse-Staff > Healers",
        "Legacy > Hunter>Ret,Arms",
        "Gorehowl > Arms, Ret",
        "Axe of the Gronn Lords > Arms, Ret",
        "Hammer of the Naaru > Ret",
        "Lurker's Cord > Common Sense",
        "Nethershard Girdle > OS",
        "Cincture of Will > Holy priest > Resto druid",
        "Malefic Girdle > Casters > Shadow",
        "Belt of Divine Inspiration > Shadow > Casters",
        "Lurker's Grasp > Common Sense",
        "Girdle of Treachery > Feral, Rogue > Hunter, Ret, Enhance",
        "Cord of Nature's Sustenance > Resto Druid > Resto shaman",
        "Gronn-Stitched Girdle > Enhancement, Hunter > Feral, Rogue, Ret",
        "Lurker's Belt > Common Sense",
        "Belt of Gale Force > Resto Shaman > Holy pala",
        "Girdle of the Prowler > OS",
        "Terror Pit Girdle > OS",
        "Lurker's Girdle > Common Sense",
        "Crimson Girdle of the Indomitable > Tank",
        "Girdle of Truth > Holy Pala",
        "Girdle of the Endless Pit > DPS warrior, Ret > Warrior Tank",
        "Ravager's Cuffs > Common Sense",
        "Harbinger Bands > Shadow, Mage > casters",
        "Bands of Indwelling > Holy Priest > Resto Druid",
        "Bands of Nefarious Deeds > Casters",
        "Ravager's Wrist-Wraps > Common Sense",
        "Bracers of the White Stag > Boomkin > Elemental",
        "Bracers of Maliciousness > Enhancement > Feral",
        "Ravager's Bands > Common Sense",
        "Whirlwind Bracers > Resto Shaman > Holy pala",
        "Stalker's War Bands > OS",
        "Ravager's Bracers > Common Sense",
        "Vambraces of Courage > Tank",
        "Bracers of Justice > Holy pala",
        "Bladespire Warbands > DPS warrior, Ret > Warrior Tank",
        "Gloves of the Fallen Defender > Feral tank > holy priest > Rest",
        "Gloves of the Fallen Champion > Pala Tank > Rest",
        "Gloves of the Fallen Hero > Mage, Warlock > Hunter",
        "Helm of the Fallen Champion > Pala tank > Rogue, Shaman, Paladin",
        "Helm of the Fallen Hero > Mage, Warlock > Hunter",
        "Helm of the Fallen Defender > Tank > Warrior, Holy Priest, Resto Druid > Rest",
        "Pauldrons of the Fallen Defender > Tank > Warrior, Boomkin, Feral > Rest",
        "Pauldrons of the Fallen Champion > Pala tank > Shaman, Paladin > Rogue",
        "Pauldrons of the Fallen Hero > Mage, Warlock > Hunter",
        "Leggings of the Fallen Defender > Feral Tank, Warrior tank > Dps Warrior> Rest",
        "Leggings of the Fallen Hero > Mage, Warlock > Hunter",
        "Leggings of the Fallen Champion > Pala Tank > Rogue > Rest",
        "Chestguard of the Fallen Defender > Tank > Warrior, Feral, Boomkin > Rest",
        "Chestguard of the Fallen Champion > Pala tank > Rogue, Paladin, Enhancement > Rest",
        "Chestguard of the Fallen Hero > Warlock > Mage > Hunter",
        "Magtheridon's Head > Feral, Mage, Warlock, Shadow, Boomkin, Hunter > Healer, Warrior Tank",
        "Belt of the Tracker > OS",
        "Boots of Elusion > Tank",
        "Drape of the Righteous > OS",
        "Grasp of the Dead > Mage",
        "Grips of Deftness > Feral, Ret, Enhancement > Warrior, rogue",
        "Inferno Waist Cord > Mage, Fire Warlock",
        "Ring of Unrelenting Storms > Elemental",
        "Ritssyn's Lost Pendant > Shadow > Warlock",
        "Zierhut's Lost Treads > Feral",
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		DB::table('guild_items')->truncate();
		
        foreach ($this->priorities as $priority) {
            $segments = explode(' > ', $priority);

            if (count($segments) < 2) {
				throw new Exception('Missing prio for ' . Arr::first($segments));
            }

            $itemId = Item::where('name', $segments[0])->firstOrFail()->item_id;
            unset($segments[0]);
            $priorityString = implode(' > ', $segments);

            $guildItem = [
                'guild_id' => 1,
                'item_id' => $itemId,
                'created_by' => 1,
                'priority' => $priorityString,
            ];
			
			if (!$guildItem) {
				throw new Exception('$guildItem is empty');
			}

			DB::table('guild_items')->insert($guildItem);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
