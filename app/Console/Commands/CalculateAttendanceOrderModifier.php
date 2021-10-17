<?php

namespace App\Console\Commands;

use App\Character;
use App\Raid;
use Illuminate\Console\Command;

class CalculateAttendanceOrderModifier extends Command
{
    private const RAIDS_THAT_COUNT = 11;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calculate-attendance-order-modifier';

    public function handle()
    {
        $raids = Raid::with('characters')
            ->whereHas('characters')
            ->orderBy('date', 'DESC')
            ->limit(self::RAIDS_THAT_COUNT)
            ->get();

        $attendedRaidsPerCharacter = [];
        foreach ($raids as $raid) {
            foreach ($raid->characters as $character) {
                $attendedRaidsPerCharacter[$character->id] = $attendedRaidsPerCharacter[$character->id] ?? 0;
                $attendedRaidsPerCharacter[$character->id]++;
            }
        }

        foreach ($attendedRaidsPerCharacter as $characterId => $raidsAttended) {
            $character = Character::findOrFail($characterId);
            $character->attendance_order_modifier = min($raidsAttended, 9) / 10;
            $character->save();
        }
    }
}