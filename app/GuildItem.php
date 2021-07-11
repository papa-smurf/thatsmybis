<?php

namespace App;

use App\Item;
use App\Guild;
use Illuminate\Database\Eloquent\Model;

class GuildItem extends Model
{
    public function item () {
		return $this->belongsTo(Item::class, 'item_id', 'item_id');
	}

	public function guild () {
		return $this->belongsTo(Guild::class);
	}
}
