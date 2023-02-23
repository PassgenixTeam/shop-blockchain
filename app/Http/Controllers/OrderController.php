<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Controllers\CoinController;

class OrderController extends Controller
{
    public function admin()
    {
        //
        $orders = Order::all();
        return view('admin/order', ['orders' => $orders]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $orders = Order::all();
        return view('admin/order', ['orders' => $orders]);
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
    public function store($id, Request $request)
    {
        //
        $product = Product::find($id);

        if(!$product) {
            return redirect('admin/order');
        }

        $coin = (new CoinController)->getCoinPrice($request->coin);

        $total_price = $product->price / $coin->price * $request->amount;

        $order = new Order();
        $order->product_id = $product->id;
        $order->amount = $request->amount;
        $order->order_status = "pending";
        $order->total_price = $total_price;
        $order->tx_message = $request->tx_message;
        $order->save();

        return [
            'id' => $order->id,
            'total_price' => $total_price,
            'symbol' => $coin->symbol];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\order  $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        $order = Order::find($id);
        if(!empty($request->tx_message)) $order->tx_message = $request->tx_message;
        if(!empty($request->order_status)) $order->order_status = $request->order_status;

        $order->save();

        return $order;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\order  $order
     * @return \Illuminate\Http\Response
     */
    public function destroy(order $order)
    {
        //
    }
}
