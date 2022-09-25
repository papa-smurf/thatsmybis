<?php

namespace App\Console\Commands;

use App\Item;
use Illuminate\Console\Command;

class ExportLinkedItems extends Command
{
	private const NETHER_VORTEX_ITEM_ID = 30183;
	
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'export-linked-items';

    public function handle()
    {
        $items = Item::whereNotNull('parent_id')
			->with('parentItem')
			->where('parent_item_id', '!=', self::NETHER_VORTEX_ITEM_ID)
			->orderBy('item_id')
			->get();

		$itemLinks = [];
		foreach ($items as $item) {
			if (!$item->item_id
				|| !$item->parentItem->item_id
				|| !$item->parentItem->name
			) {
				continue;
			}

			if (!isset($itemLinks[$item->parentItem->item_id])) {
				$itemLinks[$item->parentItem->item_id] = [
					'name' => $item->parentItem->name,
					'children' => [],
				];
			}

			// PREPEND
			if ($item->item_id === 19366) {
				$itemLinks[$item->parentItem->item_id]['children'][19003] = (object) [
					'item_id' => 19003,
					'name' => 'Head of Nefarian (Alliance)',
				];
			}
			
			$itemLinks[$item->parentItem->item_id]['children'][$item->item_id] = $item;

			// APPEND
			if ($item->item_id === 18406) {
				$itemLinks[$item->parentItem->item_id]['children'][18423] = (object) [
					'item_id' => 18423,
					'name' => 'Head of Onyxia (Alliance)',
				];

				$itemLinks[18423] = [
					'name' => 'Head of Onyxia (Alliance)',
					'children' => [
						18403 => (object) [
							'item_id' => 18403,
							'name' => 'Dragonslayer\'s Signet',
						],
						18404 => (object) [
							'item_id' => 18404,
							'name' => 'Onyxia Tooth Pendant',
						],
						18406 => (object) [
							'item_id' => 18406,
							'name' => 'Onyxia Blood Talisman',
						],
						18422 => (object) [
							'item_id' => 18422,
							'name' => 'Head of Onyxia (Horde)',
						],
					],
				];
			} else if ($item->item_id === 19384) {
				$itemLinks[19003] = [
					'name' => 'Head of Nefarian (Alliance)',
					'children' => [
						19002 => (object) [
							'item_id' => 19002,
							'name' => 'Head of Nefarian (Horde)',
						],
						19366 => (object) [
							'item_id' => 19366,
							'name' => 'Master Dragonslayer\'s Orb',
						],
						19383 => (object) [
							'item_id' => 19383,
							'name' => 'Master Dragonslayer\'s Medallion',
						],
						19384 => (object) [
							'item_id' => 19384,
							'name' => 'Master Dragonslayer\'s Ring',
						],
					],
				];
			} else if ($item->item_id === 28793) {
				$itemLinks[$item->parentItem->item_id]['children'][32386] = (object) [
					'item_id' => 32386,
					'name' => 'Magtheridon\'s Head (Horde)',
				];

				$itemLinks[32386] = [
					'name' => 'Magtheridon\'s Head (Horde)',
					'children' => [
						28790 => (object) [
							'item_id' => 28790,
							'name' => 'Naaru Lightwarden\'s Band',
						],
						28791 => (object) [
							'item_id' => 28791,
							'name' => 'Ring of the Recalcitrant',
						],
						28792 => (object) [
							'item_id' => 28792,
							'name' => 'A\'dal\'s Signet of Defense',
						],
						28793 => (object) [
							'item_id' => 28793,
							'name' => 'Band of Crimson Fury',
						],
						32385 => (object) [
							'item_id' => 32385,
							'name' => 'Magtheridon\'s Head (Alliance)',
						],
					],
				];

				// Add the faction to magtheridon's head
				$itemLinks[32385]['name'] = 'Magtheridon\'s Head (Alliance)';
			}
		}

		$lastParentItemId = null;
		$exportString = '';
		foreach ($itemLinks as $parentItemId => $details) {
			if ($lastParentItemId != $parentItemId) {
				$lastParentItemId = $parentItemId;
				$exportString .= sprintf("\n    },\n    -- %s\n    [\"%s\"] = {", $details['name'], $parentItemId);
			}

			foreach ($details['children'] as $child) {
				$exportString .= sprintf("\n        %s, -- %s", $child->item_id, $child->name);
			}
		}
		$exportString .= "\n    },";
		
		// Remove the first two lines
		$exportString = substr($exportString, strpos($exportString, "\n", strpos($exportString, "\n") + 1) + 1);
		
		echo $exportString;
    }
}