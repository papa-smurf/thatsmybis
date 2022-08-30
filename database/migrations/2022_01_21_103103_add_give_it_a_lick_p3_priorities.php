<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Arr;
use App\Item;

class AddGiveItALickP3Priorities extends Migration
{
    private $priorities = [
        "Shadowmoon Destroyer's Drape > Physical",
        "Shroud of Forgiveness > Healer",
        "Cloak of the Illidari Council > Mage, Elemental, Balance > Caster DPS",
        "Shroud of the Highborne > RDruid > Healer > Caster",
        "Nethervoid Cloak > Warlock, Shadow",
        "Pepe's Shroud of Pacification > PWarrior > PPaladin, Feral",
        "Shroud of the Final Stand > HPaladin > Healer",
        "Chestguard of the Forgotten Protector > Warrior, Hunter, Resto, Elemental",
        "Chestguard of the Forgotten Vanquisher > Feral > Rogue, Balance",
        "Chestguard of the Forgotten Conqueror > PPaladin > Shadow, HPaladin > Warlock",
        "Robes of Rhonin > Caster DPS",
        "Robe of the Shadow Council > Caster DPS",
        "Garments of Temperance > Healer",
        "Don Rodrigo's Poncho > Healer",
        "Midnight Chestguard > Enhancement, Ret > Melee",
        "Nether Shadow Tunic > Melee",
        "Golden Links of Restoration > Shaman",
        "Mail of Fevered Pursuit > Hunter, Shaman, Ret",
        "Vest of Mounting Assault > Survival > Enhance, Ret",
        "Chestguard of Relentless Storms > Elemental",
        "Glory of the Defender > PWarrior",
        "Savior's Grasp > HPaladin",
        "Heartshatter Breastplate > DWarrior, Ret",
        "Archbishop's Slippers > Priest > Healer",
        "Blue Suede Shoes > Caster DPS",
        "Slippers of the Seacaller > Mage, Warlock > Balance, Elemental",
        "Boots of the Divine Light > Priest > Druid, Shaman > HPaladin",
        "Enchanted Leather Sandals > Druid > Healer",
        "Black Featherlight Boots > Physical",
        "Naturewarden's Treads > Balance, Elemental",
        "Shadowmaster's Boots > Rogue, Feral, Enhancement, Hunter, Ret",
        "Treads of the Den Mother > Feral",
        "Stillwater Boots > Shaman > Healer",
        "Quickstrider Moccasins > Hunter, Enhance",
        "Boots of Oceanic Fury > Elemental",
        "Softstep Boots of Tracking > Hunter, Enhance",
        "Pearl Inlaid Boots > HPaladin",
        "Tide-stomper's Greaves > PPaladin",
        "Myrmidon's Treads > PWarrior",
        "Dreadboots of the Legion > Dwarrior, Ret",
        "Ring of Captured Storms > Caster DPS",
        "Ring of Calming Waves > Paladin > Shaman, Priest",
        "Band of the Abyssal Lord > PWarrior",
        "Ring of Deceitful Intent > Feral > PWarrior, Rogue",
        "Unstoppable Aggressor's Ring > DWarrior, Ret > Physical",
        "Stormrage Signet Ring > Physical DPS",
        "Band of Devastation > DWarrior, Ret",
        "Blessed Band of Karabor > Druid > Priest, Shaman",
        "Ring of Ancient Knowledge > Caster DPS",
        "Gloves of the Forgotten Vanquisher > Feral > Rogue, Balance",
        "Gloves of the Forgotten Protector > Hunter, Elemental > DWarrior",
        "Gloves of the Forgotten Conqueror > PPaladin > Warlock, Shadow",
        "Gloves of Unfailing Faith > Healer",
        "Botanist's Gloves of Growth > Resto",
        "Grips of Damnation > Enhance > Melee",
        "Fists of Mukoa > Melee",
        "Spiritwalker Gauntlets > RShaman > EShaman",
        "Grips of Silent Justice > DWarrior > Ret",
        "Gauntlets of Enforcement > PWarrior",
        "Pillager's Gauntlets > DWarrior, Ret",
        "Helm of the Forgotten Vanquisher > Feral > Rogue, Boomkin",
        "Helm of the Forgotten Conqueror > PPaladin > Warlock, Shadow, HPaladin > HPriest",
        "Helm of the Forgotten Protector > Elemental, Resto Shaman, DWarrior, Hunter > Enhance",
        "Cowl of Benevolence > Priest, Druid",
        "Cowl of the Illidari High Lord > Caster DPS",
        "Guise of the Tidal Lurker > Druid",
        "Cursed Vision of Sargeras > Physical DPS",
        "Helm of Soothing Currents > Healer",
        "Forest Prowler's Helm > Ret > Enhance, Hunter",
        "Crown of Empowered Fate > HPaladin",
        "Helm of the Illidari Shatterer > DWarrior, RPaladin",
        "Faceplate of the Impenetrable > PWarrior > PPaladin",
        "Chronicle of Dark Secrets > Mage, Balance, Warlock > Caster DPS",
        "Scepter of Purification > Priest, Druid",
        "Blind-Seers Icon > Caster DPS",
        "Touch of Inspiration > Healer",
        "Leggings of the Forgotten Conqueror > PPaladin > HPaladin, Warlock",
        "Leggings of the Forgotten Protector > RShaman, BM Hunter",
        "Leggings of the Forgotten Vanquisher > Feral > Mage, Rogue",
        "Leggings of Channeled Elements > Elemental, Boomkin > Caster DPS",
        "Leggings of Eternity > HPriest > RDruid",
        "Leggings of Devastation > Shadow > Caster DPS",
        "Shady Dealer's Pantaloons > DWarrior, Hunter, Enhance, Rogue",
        "Kilt of Immortal Nature > Druid",
        "Sun-touched Chain Leggings > RShaman",
        "Bow-stitched Leggings > Enhance, Ret, Survival",
        "Legguards of Endless Rage > DWarrior, Ret",
        "Praetorian's Legguards > PWarrior",
        "Leggings of Divine Retribution > DWarrior",
        "The Maelstrom's Fury > Elemental, Boomkin, Shadow",
        "Claw of Molten Fury > Enhance",
        "Hammer of Atonement > Paladin > Druid",
        "Crystal Spire of Karabor > HPriest, RShaman > Druid",
        "Hammer of Judgement > PPaladin, Balance, Shadow, Elemental",
        "Tempest of Chaos > Warlock, Mage, PPaladin",
        "Warglaive of Azzinoth (mainhand) > LC",
        "Warglaive of Azzinoth (offhand) > LC",
        "Choker of Endless Nightmares > DWarrior, Enhance, Ret > Rogue",
        "Pendant of Titans > Feral, PWarrior",
        "Translucent Spellthread Necklace > Caster DPS",
        "Nadina's Pendant of Purity > Healer",
        "Choker of Serrated Blades > Rogue, Hunter > Physical DPS (-Feral)",
        "Hellfire-Encased Pendant > Mage, Warlock",
        "Fist of Molten Fury > Hunter",
        "Tracker's Blade > Hunter, Rogue",
        "Boundless Agony > Hunter",
        "Messenger of Fate > Hunter, Rogue",
        "Shard of Azzinoth > Hunter, Rogue",
        "Rising Tide > Enhance, FWarrior",
        "The Brutalizer > PWarrior",
        "Syphon of the Nathrezim > Enhance",
        "Swiftsteel Bludgeon > Physical",
        "The Unbreakable Will > PWarrior",
        "Blade of Infamy > Hunter > Warrior, Rogue",
        "Blade of Savagery > Rogue, Warrior",
        "Bristleblitz Striker > Hunter",
        "Black Bow of the Betrayer > Hunter",
        "Legionkiller > PWarrior",
        "Rifle of the Stoic Guardian > PWarrior",
        "Wand of Prismatic Focus > Caster DPS",
        "Naaru-Blessed Life Rod > Priest",
        "Idol of the White Stag > Feral",
        "Tome of the Lightbringer > PPaladin",
        "Totem of Ancestral Guidance > Elemental",
        "Bastion of Light > RShaman",
        "Kaz'rogal's Hardened Heart > PWarrior",
        "Antonidas's Aegis of Rapt Concentration > EShaman > PPaladin",
        "Felstone Bulwark > HPaladin > EShaman",
        "Bulwark of Azzinoth > PWarrior, PPaladin",
        "Illidari Runeshield > PPaladin",
        "Pauldrons of the Forgotten Conqueror > PPaladin > HPaladin, Warlock, Shadow",
        "Pauldrons of the Forgotten Protector > Warrior, Hunter, EShaman, REShaman",
        "Pauldrons of the Forgotten Vanquisher > Feral > Rogue, Balance",
        "Hatefury Mantle > Caster DPS",
        "Amice of Brilliant Light > Healer",
        "Blood-cursed Shoulderpads > Caster DPS",
        "Razorfury Mantle > Rogue, Feral",
        "Mantle of Darkness > Enhance",
        "Veil of Turning Leaves > Druid",
        "Beast-tamer's Shoulders > Hunter",
        "Shoulders of the Hidden Predator > Physical DPS",
        "The Wavemender's Mantle > Healer",
        "Blood-stained Pauldrons > Physical DPS",
        "Glimmering Steel Mantle > HPaladin",
        "Pauldrons of Abyssal Fury > Tank",
        "Twisted Blades of Zarak > DWarrior > Rogue",
        "Shadowmoon Insignia > Feral > Tank",
        "Madness of the Betrayer > DWarrior, Hunter, Enhance > Rogue, Ret",
        "The Skull of Gul'dan > Warlock, Mage > Caster DPS",
        "Memento of Tyrande > Shaman, Paladin",
        "Halberd of Desolation > Hunter",
        "Pillar of Ferocity > Feral",
        "Apostle of Argus > Druid",
        "Staff of Immaculate Recovery > Healer",
        "Zhar'doom, Greatstaff of the Devourer > Caster DPS",
        "Soul Cleaver > Arms",
        "Torch of the Damned > Ret",
        "Cataclysm's Edge > Arms > Ret",
        "Anetheron's Noose > Caster DPS (-shadow, elemental)",
        "Angelista's Sash > Priest",
        "Waistwrap of Infinity > Shadow > Warlock, Mage",
        "Belt of Divine Guidance > Priest",
        "Don Alejandro's Money Belt > Hunter",
        "Belt of the Crescent Moon > Balance > EShaman",
        "Shadow-walker's Cord > Ret, Enhance",
        "Belt of Primal Majesty > Druid > Shaman",
        "Valestalker Girdle > Ret, Enhance",
        "Naturalist's Preserving Cinch > RShaman > HPaladin",
        "Flashfire Girdle > Elemental",
        "Boneweave Girdle > Hunter, Enhance",
        "Belt of Seething Fury > Physical DPS",
        "Girdle of Hope > HPaladin",
        "Girdle of Lordaeron's Fallen > HPaladin",
        "Girdle of Stability > PWarrior",
        "Girdle of Mighty Resolve > PPaladin",
        "Girdle of the Lightbearer > Physical DPS",
        "Cuffs of Devastation > Mage > Caster DPS",
        "Bracers of Martyrdom > Priest > Druid",
        "Focused Mana Bindings > Caster DPS (-elemental)",
        "Wristbands of Divine Influence > Healer",
        "Rejuvenating Bracers > Druid",
        "Deadly Cuffs > DWarrior, Feral",
        "Insidious Bands > Physical",
        "Elunite Empowered Bracers > Balance",
        "Bracers of the Pathfinder > Physical",
        "Howling Wind Bracers > Shaman > Paladin",
        "Wraps of Precise Flight > Physical",
        "Bands of the Coming Storm > Caster DPS",
        "Blessed Adamantite Bracers > HPaladin",
        "Furious Shackles > DWarrior, Ret",
        "Eternium Shell Bracers > Tank",
        "The Seeker's Wristguards > PPaladin",
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