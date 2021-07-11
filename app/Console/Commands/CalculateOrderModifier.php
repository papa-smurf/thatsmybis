<?php

namespace App\Console\Commands;

use App\Character;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;

class CharacterRecalculateDKP extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'character:calculate-modifier';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate all character order modifiers';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
		$htmlContent = file_get_contents("https://classic.warcraftlogs.com/guild/attendance-table/530497/0/0?page=1");
		
		$DOM = new \DOMDocument();
		libxml_use_internal_errors(true);
		$DOM->loadHTML('<?xml encoding="utf-8" ?>' . $htmlContent);
		
		$Header = $DOM->getElementsByTagName('th');
		$Detail = $DOM->getElementsByTagName('td');
		$ScriptTags = $DOM->getElementsByTagName('script');

		//#Get header name of the table
		$i = 0;
		foreach($Header as $NodeHeader)
		{
			if ($i < 2) {
				$aDataTableHeaderHTML[] = $NodeHeader->textContent;
				$i ++;
				continue;
			}

			$matchingScriptTag = $ScriptTags[$i - 2];
			preg_match('/new\ Date\(([0-9]{13})\)/', $matchingScriptTag->c14n(), $matches);

			$date = $matches[1] ?? '';
			
			$aDataTableHeaderHTML[] = trim($NodeHeader->textContent . ' ' . $date);
			$i++;
		}
		//print_r($aDataTableHeaderHTML); die();

		//#Get row data/detail table without header name as key
		$i = 0;
		$j = 0;
		foreach($Detail as $sNodeDetail) 
		{
			$attendanceTable[$j][] = trim($sNodeDetail->textContent);
			$i = $i + 1;
			$j = $i % count($aDataTableHeaderHTML) == 0 ? $j + 1 : $j;
		}
		
		//#Get row data/detail table with header name as key and outer array index as row number
		for($i = 0; $i < count($attendanceTable); $i++)
		{
			for($j = 0; $j < count($aDataTableHeaderHTML); $j++)
			{
				$aTempData[$i][$aDataTableHeaderHTML[$j]] = $attendanceTable[$i][$j];
			}
		}
		$attendanceTable = $aTempData; unset($aTempData);

		$characters = [];
		foreach ($attendanceTable as $attendanceRows) {
			$character = [
				'name' => '',
				'attended' => [],
				'modifier' => 0,
			];

			$i = 1;
			foreach ($attendanceRows as $val) {
				if ($i === 1) {
					$character['name'] = trim($val);
				} elseif ($i > 2) {
					$header = $aDataTableHeaderHTML[$i - 1];
					$instance = substr($header, 0, strlen($header) - 14);
					$date = date('Y-m-d', substr($header, -13, 10));

// 					echo sprintf(
// 						"%s | %s | %s\n",
// 						substr($header, -13),
// 						$header,
// 						$date
// 					);

					if (Arr::get($character['attended'], $instance . $date, false) === true) {
						$i++;
						continue;
					}

					$character['attended'][$instance . $date] = $val > 0 ? true : false;
				}

				$i++;
			}

			$i = 1;
			foreach ($character['attended'] as $attended) {
				if ($attended) {
					$character['modifier'] += .1;
				}

				// TEMPORARY!!!!
				// if ($i > 11) {
				if ($i >= 5) {
					break;
				}

				$i ++;
			}

			if ($character['modifier'] > .9) {
				$character['modifier'] = .9;
			}
			
			// TEMPORARY!
			// $character['modifier'] = 0;
			$characters[] = $character;
		}

		foreach ($characters as $characterAttendance) {
			if (!$characterAttendance['name']) {
				continue;
			}
			
			$character = Character::where('name', $characterAttendance['name'])->first();

			if (!$character) {
				// echo "Character '{$characterAttendance['name']}' doesn't exist\n";
				continue;
			}

			$character->order_modifier = $characterAttendance['modifier'];
			$character->save();
		}
    }
}
