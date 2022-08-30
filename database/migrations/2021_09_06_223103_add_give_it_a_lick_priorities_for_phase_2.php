<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Arr;
use App\Item;

class AddGiveItALickPrioritiesForPhase2 extends Migration
{
    private $priorities = [
		"Razor-Scale Battlecloak > Retri, Enhance > Melee",
		"Phoenix-Wing Cloak > Feral Tank, Prot Paladin",
		"Thalassian Wildercloak > Hunter, Feral, Rogue",
		"Royal Cloak of the Sunstriders > Shadow, Arcane Mage, Prot Pala > Caster DPS",
		"Sunshower Light Cloak > Healer",
		"Ranger-General's Chestguard > Survival > BM, Enhance",
		"Robe of Hateful Echoes > Caster DPS",
		"Glowing Breastplate of Truth > Holy Paladin",
		"Bloodsea Brigand's Vest > Melee DPS > Hunter",
		"Gnarled Chestpiece of the Ancients > Resto Druid",
		"Fire Crest Breastplate > Resto Shaman > Paladin",
		"Krakken-Heart Breastplate > DPS Warrior, Ret Pala",
		"Vestments of the Sea-Witch > Warlock, Fire Mage, Frost Mage > Caster DPS",
		"Boots of the Shifting Nightmare > Warlock, Shadow",
		"Tempest-Strider Boots > Resto Shaman",
		"Boots of Effortless Striking > Feral Tank",
		"Velvet Boots of the Guardian > Elemental, Boomkin, Arcane Mage > Caster DPS",
		"Orca-Hide Boots > Resto Druid, Resto Shaman",
		"Soul-Strider Boots > Holy Priest > Resto Druid",
		"Warboots of Obliteration > Warrior DPS, Retri Paladin",
		"Star-Strider Boots > Hunter, Enchance > Retri, Warrior DPS",
		"Cobra-Lash Boots > Hunter, Enchance > Retri, Warrior DPS",
		"Boots of Courage Unending > Holy Paladin",
		"Boots of the Resilient > Tank",
		"Ring of Lethality > Non Retri Melee, Hunter",
		"Band of Vile Aggression > OS",
		"Ancestral Ring of Conquest > Melee",
		"The Seal of Danzalar > Prot Pala",
		"Band of the Vigilant > OS",
		"Ring of Sundered Souls > Tank",
		"Coral Band of the Revived > Healer",
		"Ring of Endless Coils > Non shadow/arcane caster DPS, Prot Paladin",
		"Band of Al'ar > Arcance, Shadow",
		"Phoenix-Ring of Rebirth > Resto Shaman, Holy Paladin > Healer",
		"Band of the Ranger-General > Melee, Hunter",
		"Seventh Ring of the Tirisfalen > Prot Pala > Prot Warrior",
		"Gauntlets of the Sun King > Arcane > Caster DPS",
		"Gloves of the Searing Grip > Warrior, Retri > Melee",
		"Bark-Gloves of Ancient Wisdom > Resto Druid",
		"Worldstorm Gauntlets > Resto Shaman",
		"Glorious Gauntlets of Crestfall > Holy Paladin",
		"Royal Gauntlets of Silvermoon > Tank",
		"Cowl of the Grand Engineer > Caster DPS",
		"Crown of the Sun > Holy Priest, Resto Druid",
		"Brighthelm of Justice > Holy Paladin",
		"Fel-Steel Warhelm > DPS Warrior, Retri",
		"Fathomstone > Elemental, Warlock > Caster DPS",
		"Talisman of the Sun King > Holy Priest, Resto Druid",
		"Star-Soul Breeches > Holy Priest, Resto Druid",
		"Trousers of the Astromancer > Shadow > Caster DPS",
		"Leggings of Murderous Intent > DPS Warrior, Retri, Hunter > Feral",
		"Void Reaver Greaves > Survival > Hunter",
		"Sunhawk Leggings > Resto Shaman > Holy Paladin",
		"Greaves of the Bloodwarder > Warrior DPS, Retri",
		"Talon of the Phoenix > Hunter, Enhancement",
		"Mallet of the Tides > Prot Warrior",
		"Fang of the Leviathan > Non Arcane Mage, Warlock, Prot Pala",
		"Lightfathom Scepter > Healer",
		"Choker of Animalistic Fury > Melee, Hunter",
		"Frayed Tether of the Drowned > Feral Tank, Prot Warrior",
		"Pendant of the Lost Ages > Caster DPS",
		"Pendant of the Perilous > Ret, Warrior DPS",
		"Claw of the Phoenix > Hunter",
		"Talon of Azshara > Rogue, Warrior DPS > Hunter",
		"Heartrazor > OS",
		"Netherbane > Enhancement, Hunter",
		"Rod of the Sun King > Enhancement, Warrior DPS",
		"Fang of Vashj > OS",
		"Luminescent Rod of the Naaru > Holy Priest",
		"Arcanite Steam-Pistol > Hunter",
		"Serpent Spine Longbow > Hunter",
		"Serpentshrine Shuriken > Prot Warrior > Melee DPS",
		"Wand of the Forgotten Star > Caster DPS",
		"Idol of the Crescent Goddess > Resto Druid",
		"Libram of Absolute Truth > Holy Paladin",
		"Pauldrons of the Wardancer > Warrior DPS, Retri",
		"Mantle of the Elven Kings > Non shadow caster DPS",
		"Shoulderpads of the Stranger > Melee DPS",
		"Coral-Barbed Shoulderpads > Resto Shaman",
		"Pauldrons of the Argent Sentinel > Holy Paladin",
		"Mantle of the Tireless Tracker > Hunter, Enhancement",
		"Illidari Shoulderpads > Caster DPS",
		"Runetotem's Mantle > Resto Druid",
		"Totem of the Maelstrom > Resto Shaman",
		"Scarab of Displacement > Tank",
		"Living Root of the Wildheart > Druid",
		"Earring of Soulful Meditation > Holy Priest",
		"Tsunami Talisman > Melee DPS, Feral > Hunter",
		"Sextant of Unstable Currents > Caster DPS",
		"Fathom-Brooch of the Tidewalker > Shaman",
		"Serpent-Coil Braid > Arcane Mage",
		"Prism of Inner Calm > LC",
		"Spyglass of the Hidden Fleet > Tank",
		"Fel Reaver's Piston > Healer",
		"Warp-Spring Coil > Rogue",
		"Talon of Al'ar > Hunter",
		"Tome of Fiery Redemption > Paladin",
		"Void Star Talisman > Warlock",
		"Solarian's Sapphire > Warrior",
		"Wildfury Greatstaff > Feral Tank",
		"Ethereum Life-Staff > Holy Priest, Resto Druid",
		"The Nexus Key > Elemental Shaman, Arcane Mage, Boomkin > Caster DPS",
		"World Breaker > Warrior DPS, Retri",
		"Twinblade of the Phoenix > Warrior DPS, Ret > Hunter",
		"Cord of Screaming Terrors > Caster DPS",
		"Fire-Cord of the Magus > Fire Mage, Warlock",
		"Girdle of the Invulnerable > Tank",
		"Girdle of Zaetar > Resto Druid",
		"Girdle of the Tidal Call > Enhance, Retri",
		"Girdle of Fallen Stars > Resto Shaman, Holy Paladin",
		"Belt of One-Hundred Deaths > Feral Tank, Prot Warrior > Melee DPS",
		"Girdle of the Righteous Path > Holy Paladin",
		"Blackfathom Warbands > Resto Shaman, Holy Paladin",
		"Mindstorm Wristbands > Warlock, Mage > Caster DPS",
		"Wraps of Purification > Holy Priest",
		"Vambraces of Ending > Rogue, Feral, Hunter",
		"Bracers of Eradication > Warrior DPS, Retri",
		"Grove-Bands of Remulos > Resto Druid",
		"Bands of the Celestial Archer > Hunter",
		"True-Aim Stalker Bands > Enhancement",
		"Wristguards of Determination > Prot Paladin > Prot Warrior",
		"Verdant Sphere > All (-Ret, Shadow, Rogue, Warrior DPS)",
		"Gloves of the Vanquished Defender > Feral, Boomkin, Holy Priest",
		"Gloves of the Vanquished Champion > Prot, Rogue, Enhancement",
		"Gloves of the Vanquished Hero > Arcane, BM",
		"Leggings of the Vanquished Hero > Mage > Warlock, Hunter",
		"Leggings of the Vanquished Champion > Pala, Non Resto Shaman, Rogue",
		"Leggings of the Vanquished Defender > Feral, Warrior, Priest",
		"Helm of the Vanquished Hero > Warlock, Mage, Hunter",
		"Helm of the Vanquished Champion > Non Elemental Shaman",
		"Helm of the Vanquished Defender > Non Shadow",
		"Pauldrons of the Vanquished Champion > Healer > Rogue, Retri",
		"Pauldrons of the Vanquished Defender > Warrior, Druid, Priest",
		"Pauldrons of the Vanquished Hero > Hunter, Mage",
		"Chestguard of the Vanquished Hero > Hunter, Arcane",
		"Chestguard of the Vanquished Champion > Non Prot",
		"Chestguard of the Vanquished Defender > Warrior, Druid, Priest",
	];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
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