<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Arr;
use App\Item;

class AddGargulP5Priorities extends Migration
{
    private $priorities = [
		"Belt of the Forgotten Conqueror > Tank > Rest",
		"Belt of the Forgotten Protector > Tank > Rest",
		"Belt of the Forgotten Vanquisher > Tank > Rest",
		"Boots of the Forgotten Conqueror > Tank > Rest",
		"Boots of the Forgotten Protector > Tank > Rest",
		"Boots of the Forgotten Vanquisher > Tank > Rest",
		"Bracers of the Forgotten Conqueror > Tank > Rest",
		"Bracers of the Forgotten Protector > Tank > Rest",
		"Bracers of the Forgotten Vanquisher > Tank > Rest",
		"Cloak of Unforgivable Sin > Physical DPS",
		"Crimson Paragon's Cover > Tank",
		"Shroud of Redeemed Souls > Healer",
		"Tattered Cape of Antonidas > Caster",
		"Fel Conquerer Raiments > Warlock, Boomkin, Elemental, Shadow > Mage",
		"Robes of Faltered Light > Mage, Holy Priest, Restro Druid",
		"Robes of Ghostly Hatred > Mage, Holy Priest, Resto Druid",
		"Harness of Carnal Instinct > Feral tank > Physical DPS",
		"Bladed Chaos Tunic > Feral tank > Physical DPS",
		"Sunglow Vest > Boomkin, Resto Shaman, Holy Pala",
		"Utopian Tunic of Elune > Boomkin, Resto Shaman, Holy Pala",
		"Garments of Serene Shores > Elemental, Resto Shaman",
		"Garments of Crashing Shores > Elemental, Reso Shaman",
		"Vicious Hawkstrider Hauberk > Whoever wants it",
		"Heroic Judicator's Chestguard > Prot Pala > Holy Pala",
		"Noble Judicator's Chestguard > Prot Pala > Holy Pala",
		"Warharness of Reckless Fury > Prot Warrior > Ret, Warrior DPS",
		"Breastplate of Agony's Aversion > Prot Warrior > Ret, Warrior DPS",
		"Band of Lucent Beams > Healer",
		"Band of Ruinous Delight > Physical DPS > Survial",
		"Ring of Hardened Resolve > Tank",
		"Ring of Harmonic Beauty > Healer",
		"Ring of Omnipotence > Caster",
		"Sin'dorei Band of Dominance > PvP OS",
		"Sin'dorei Band of Salvation > PvP OS",
		"Sin'dorei Band of Triumph > PvP OS",
		"Handguards of Defiled Worlds > Warlock, Shadow",
		"Handguards of the Dawn > Holy Priest, Mage, Resto Druid",
		"Gloves of Tyri's Power > Holy Priest, Mage, Resto Druid",
		"Shadowed Gauntlets of Paroxysm > Feral > Rogue",
		"Gloves of the Forest Drifter > Feral > Rogue",
		"Tranquil Majesty Wraps > Resto Druid, Boomkin",
		"Tranquil Moonlight Wraps > Resto Druid, Boomkin",
		"Gauntlets of the Ancient Shadowmoon > Resto Shaman. Elemental",
		"Gauntlets of the Ancient Frostwolf > Resto Shaman, Elemental",
		"Thalassian Ranger Gauntlets > Physical DPS > Rogue",
		"Borderland Fortress Grips > Prot Pala, Prot Warrior",
		"Borderland Paingrips > Warrior DPS",
		"Gauntlets of the Soothed Soul > Holy Pala",
		"Cowl of Light's Purity > Holy Priest, Resto Druid",
		"Helm of Arcane Purity > Holy Priest, Resto Druid",
		"Dark Conjuror's Collar > Warlock, Shadow, Boomkin",
		"Cover of Ursol the Wise > Resto Druid > Boomkin",
		"Cover of Ursoc the Mighty > Resto Druid > Boomkin",
		"Duplicitous Guise > Feral, Rogue, Ret, Enhance",
		"Mask of the Fury Hunter > Feral, Rogue, Ret, Enhance",
		"Coif of Alleria > Hunter, Enhance",
		"Cowl of Gul'dan > Resto Shaman, Elemental, Holy Pala",
		"Shroud of Chieftain Ner'zhul > Resto Shaman, Elemental, Holy Pala",
		"Crown of Anasterian > Warrior, Ret",
		"Crown of Dath'Remar > Warrior, Ret",
		"Helm of Burning Righteousness > Prot Pala > Holy Pala",
		"Helm of Uther's Resolve > Prot Pala > Holy Pala",
		"Book of Highborne Hymns > Healer",
		"Heart of the Pit > Caster",
		"Leggings of Calamity > Warlock > Caster",
		"Pantaloons of Calming Strife > Mage, Shadow, HPriest > Caster, Healer",
		"Pantaloons of Growing Strife > Mage, Shadow, HPriest > Caster, Healer",
		"Breeches of Natural Aggression > Boomkin, Resto Druid",
		"Breeches of Natural Splendor > Boomkin, Resto Druid",
		"Leggings of the Immortal Night > Feral Tank > Physical DPS",
		"Leggings of the Immortal Beast > Feral Tank > Physical DPS",
		"Chain Links of the Tumultuous Storm > Elemental, Resto Shaman, Holy Paladin",
		"Kilt of Spiritual Reconstruction > Elemental, Resto Shaman, Holy Paladin",
		"Starstalker Legguards > Hunter, Enhance",
		"Felfury Legplates > Prot Warrior > Warrior DPS, Ret",
		"Felstrength Legplates > Prot Warrior > Warrior DPS, Ret",
		"Legplates of the Holy Juggernaut > Prot pala > Holy Pala",
		"Judicator's Legguards > Prot pala > Holy Pala",
		"Sunflare > Caster",
		"Hand of the Deceiver > Enhance > Fury, Rogue > Hunter",
		"Archon's Gavel > Healer",
		"Hammer of Sanctification > Holy Pala, Resto Shaman",
		"Amulet of Unfettered Magics > Caster",
		"Brooch of the Highborne > Healer",
		"Clutch of Demise > Physical DPS",
		"Collar of the Pit Lord > Tank",
		"Sin'dorei Pendant of Conquest > PvP OS",
		"Sin'dorei Pendant of Salvation > PvP OS",
		"Sin'dorei Pendant of Triumph > PvP OS",
		"Grip of Mannoroth > Hunter, Fury",
		"Mounting Vengeance > Enhance > Fury",
		"Crux of the Apocalypse > Hunter",
		"Fang of Kalecgos > Whoever wants it",
		"Shiv of Exsanguination > Hunter",
		"Reign of Misery > Shadow, Boomkin, Elemental",
		"Dragonscale-Encrusted Longblade > Prot Warrior",
		"Muramasa > Rogue, Fury",
		"Golden Bow of Quel'Thalas > Hunter > Warrior",
		"Thori'dal, the Stars' Fury > Hunter",
		"Blade of Life's Inevitability > Prot Warrior",
		"Wand of Cleansing Light > Holy Priest",
		"Wand of the Demonsoul > Mage, Warlock, Shadow",
		"Aegis of Angelic Fortune > Resto Shaman, Holy Pala",
		"Sword Breaker's Bulwark > Prot Pala, Prot Warrior",
		"Amice of the Convoker > Warlock, Boomkin",
		"Shawl of Wonderment > Holy Priest > Caster, Healer",
		"Shoulderpads of Knowledge's Pursuit > Holy Priest > Caster, Healer",
		"Shoulderpads of Vehemence > Feral Tank > Ret",
		"Demontooth Shoulderpads > Feral Tank > Ret",
		"Spaulders of Reclamation > Boomkin, Resto Druid",
		"Spaulders of Devastation > Boomkin, Resto Druid",
		"Equilibrium Epaulets > Elemental, Resto Shaman",
		"Erupting Epaulets > Elemental, Resto Shaman",
		"Mantle of the Golden Forest > Enhance > DPS Warrior",
		"Pauldrons of Perseverance > Prot Warrior > Warrior DPS, Ret",
		"Pauldrons of Berserking > Prot Warrior > Warrior DPS, Ret",
		"Spaulders of the Thalassian Savior > Prot Pala > Holy Pala",
		"Spaulders of the Thalassian Defender > Prot Pala > Holy Pala",
		"Blackened Naaru Sliver > Physical DPS",
		"Glimmering Naaru Sliver > Healer",
		"Shifting Naaru Sliver > Caster",
		"Steely Naaru Sliver > Prot Warrior",
		"Shivering Felspine > Hunter, Ret",
		"Golden Staff of the Sin'dorei > Holy Priest, Resto Druid",
		"Grand Magister's Staff of Torrents > Caster",
		"Stanchion of Primal Instinct > Feral",
		"Apolyon, the Soul-Render > Ret, Arms",
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

			try {
				$itemId = Item::where('name', $segments[0])->firstOrFail()->item_id;
			} catch (\Exception $e) {
				throw new Exception("Item with name '{$segments[0]}' not found");
			}

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