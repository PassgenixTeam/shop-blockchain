<?php

namespace App\Http\Controllers;

use App\myEthereum;
use Illuminate\Http\Request;

use Ethereum\Ethereum;



class MyEthereumController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $ethereum = new Ethereum(env('ETHEREUM_HTTP_PROVIDER'));

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
