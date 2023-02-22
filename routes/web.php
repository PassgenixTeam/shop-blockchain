<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\MyEthereumController;

use Illuminate\Support\Facades\Input;
use GuzzleHttp\Client;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function () {
    Route::get('/product', [ProductController::class, 'admin']);
    Route::get('/order', [OrderController::class, 'admin']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::post('/product', [ProductController::class, 'store']);

Route::get('/product/{id}', [ProductController::class, 'getById']);

Route::post('/order/product/{id}', [OrderController::class, 'store']);

// ethereum
Route::get('/ethereum', [MyEthereumController::class, 'index']);

Route::get('/coin', function () {
    $symbol = request('symbol');
    $client = new Client();
    $url = 'https://api.binance.com/api/v3/ticker/price?symbols=' . $symbol;
    // $response = $client->get($url);
    $response = $client->request('GET', $url, [
        'headers' => [
            'X-MBX-APIKEY' => '0VBHGpJZzXVH7DT9T4VACj4JaR0Ujxu7Q3epGEq8yGWv7gj8vh3af4s3tRrVfo7a'
        ]
    ]);

    $data = json_decode($response->getBody(), true);
    return $data;
});

Route::get('/abi-shop', function () {
    $typeAbi = request('type');

    if( $typeAbi == 'shop' ) {
        $public_path = public_path();
        $file_path = $public_path . '/abi/Shop.abi.json';
        $file_contents = file_get_contents($file_path);

        return json_decode($file_contents);
    }

    $public_path = public_path();
    $file_path = $public_path . '/abi/TokenERC20.abi.json';
    $file_contents = file_get_contents($file_path);

    return json_decode($file_contents);
});
