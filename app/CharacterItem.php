<?php

namespace App;

use App\Character;
use App\Item;
use Illuminate\Database\Eloquent\Model;

class CharacterItem extends Model
{
	public function character() {
        return $this->belongsTo(Character::class);
    }

	public function item() {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
