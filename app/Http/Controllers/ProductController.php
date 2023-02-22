<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function admin()
    {
        //
        $products = Product::all();
        return view('admin/product', ['products' => $products]);
    }

    public function index()
    {
        //
        $products = Product::all();
        return view('product', ['products' => $products]);
    }

    public function getById($id) {
        $product = Product::find($id);
        return view('product-detail', ['product' => $product]);
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
        // $request->validate([
        //     'name' => 'required',
        //     'description' => 'required',
        //     'image' => 'required',
        //     'price' => 'required',
        // ]);

        // $request->file('image')->store('storage');
        $filename = $request->file('image')->getClientOriginalName();

        $request->file('image')->move(public_path('images/'), $filename);

        $model = new Product();
        $model->name = $request->name;
        $model->description = $request->description;
        $model->image = "images/".$filename;
        $model->price =  $request->price;


        if($model->save()){
            return  redirect('admin/product');
        }else{
            return 'fail';
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProductController  $productController
     * @return \Illuminate\Http\Response
     */
    public function show(ProductController $productController)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProductController  $productController
     * @return \Illuminate\Http\Response
     */
    public function edit(ProductController $productController)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProductController  $productController
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProductController $productController)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProductController  $productController
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProductController $productController)
    {
        //
    }
}
