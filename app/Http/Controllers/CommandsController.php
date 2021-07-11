<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;

class CommandsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(['auth', 'seeUser']);
    }

    /**
     * Recalculate the order modifiers.
     *
     * @return \Illuminate\Http\Response
     */
    public function recalculateOrderModifiers()
    {
		\Artisan::call(\App\Console\Commands\CharacterRecalculateDKP::class);

        return redirect()->back();
    }
}
