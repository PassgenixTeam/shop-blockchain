<?php

namespace App\Http\Controllers;

use App\myEthereum;
use Illuminate\Http\Request;

use kornrunner\Keccak;
use kornrunner\Secp256k1;
use kornrunner\Serializer\HexSignatureSerializer;

// require_once "vendor/autoload.php";

class MyEthereumController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        exec("node ../signMessage.cli.js ".$request->txMessage, $output, $return);
        return $output[0];
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ethereum  $ethereum
     * @return \Illuminate\Http\Response
     */
    public function show(ethereum $ethereum)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ethereum  $ethereum
     * @return \Illuminate\Http\Response
     */
    public function edit(ethereum $ethereum)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ethereum  $ethereum
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ethereum $ethereum)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ethereum  $ethereum
     * @return \Illuminate\Http\Response
     */
    public function destroy(ethereum $ethereum)
    {
        //
    }
}
