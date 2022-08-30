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

			$itemLinks[$item->parentItem->item_id]['children'][$item->item_id] = $item;
		}

		$lastParentItemId = null;
		$exportString = '';
		foreach ($itemLinks as $parentItemId => $details) {
			if ($lastParentItemId != $parentItemId) {
				$lastParentItemId = $parentItemId;
				$exportString .= sprintf("\n},\n-- %s\n[\"%s\"] = {", $details['name'], $parentItemId);
			}

			foreach ($details['children'] as $child) {
				$exportString .= sprintf("\n\t%s, -- %s", $child->item_id, $child->name);
			}
		}
		$exportString .= "\n},";
		
		// Remove the first two lines
		$exportString = substr($exportString, strpos($exportString, "\n", strpos($exportString, "\n") + 1) + 1);
		
		echo $exportString;
    }
}