<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
            crossorigin="anonymous"
        />
        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"
        ></script>
        <title>Document</title>
        <style>
            .list {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img
                            src="{{ asset($product->image) }}"
                            class="img-fluid rounded-start"
                            alt="..."
                        />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">{{$product->name}}</h5>
                            <p class="card-text">{{$product->description}}</p>
                            <p class="card-text" id="price">
                                $ {{$product->price}}
                            </p>
                            <form id="order-form">
                                @csrf
                                <input
                                    type="hidden"
                                    name="id"
                                    value="{{ $product->id }}"
                                />
                                <input
                                    type="hidden"
                                    name="name"
                                    value="{{ $product->name }}"
                                />
                                <div class="input-group mb-3">
                                    <span class="input-group-text">Amount</span>
                                    <input
                                        type="number"
                                        value="1"
                                        name="amount"
                                        id="amount"
                                        class="form-control"
                                    />
                                </div>
                                <br />
                                <div class="input-group mb-3">
                                    <select
                                        class="form-select"
                                        aria-label="Default select example"
                                        name="coin"
                                        style="max-width: 100px"
                                    >
                                        <option selected>Coin</option>
                                    </select>
                                    <input
                                        type="text"
                                        value="0"
                                        disabled="disabled"
                                        class="form-control"
                                        id="coin-to-usd"
                                        style="background-color: white"
                                    />
                                    <!-- <span class="input-group-text">$</span> -->
                                </div>
                                <button type="submit" class="btn btn-primary">
                                    Buy
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <h5 class="mt-5">My Balance:</h5>
            <p id="userBalance"></p>

            <h5 class="mt-5">Is Owner: <strong id="isOwner"></strong></h5>
            <button
                type="button"
                id="withdraw"
                class="btn btn-primary disabled"
            >
                Withdraw
            </button>
            <p id="ownerBalance"></p>

            <h5 class="mt-5">Contract Balance:</h5>
            <p id="contractBalance"></p>
        </div>
    </body>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"></script>
    <!--  -->
    <script
        type="module"
        src="{{ URL::asset('/js/product-detail/main.js') }}"
    ></script>
</html>
