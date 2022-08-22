$(function () {
    'use strict'

    let 
    output        = null,
    newCount      = null,
    coinID        = [],
    ajaxCallObj   = {},
    coinMeta      = [],
    allCoinsArray = [];

    //======================//
    // * HELPER FUNCTIONS * //
    //======================//
    //Sort array by rank
    let sortByRank = (array, key) => {
        return array.sort((a, b) => {
            let 
            x = a[key],
            y = b[key];

            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    //====================//
    // * MAIN FUNCTIONS * //
    //====================//
    // Handle big numbers
    let big_int_format = ( num = null ) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // INITIATE MAIN FUNCTIONS
    // arg -n- plays the role of coins to be called counter
    let get_ids = (n = 1) => {
        $.ajax({
            url: 'https://api.coingecko.com/api/v3/coins/',
            dataType: 'json',
            method: 'GET',
            statusCode: {
                404: () => {
                    alert('Error 404')
                }
            },
            data: {
                'Access-Control-Allow-Origin':'cors',
            },
            success: response => {
                let
                coinsLength = response.length,
                data        = response;

                return [...Array(n)].forEach((element, index) => {
                    coinID.push( data[index].id );
                });
            },
            error: err => {
                console.log(err);
            },
        }).done(() => { 
            return get_prices(); 
        });
    }

    // add this inside change event
    // note that the maximum number of ids available is 50
    get_ids(10);

    //API call/s depending on the ammount of coin ids captured by get_ids()
    //Upon success, ajax is building independent object called coinMeta.
    let get_prices = async () => {
        $( $(coinID).get().reverse() ).each((_,id) => {
            ajaxCallObj[newCount] = $.ajax({
                url: `https://api.coingecko.com/api/v3/coins/${id}?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true&days=1`,   
                dataType: "json",
                method: "GET",
                statusCode: {
                    404: () => {
                        alert('404 Error');
                    },
                },
                data: {
                    'Access-Control-Allow-Origin':'cors',
                },
                success: response => {
                    // console.log(response);
                },
                error: err => {
                    console.log(err);
                }
            }).done((data) => {
                newCount++
                for (var i=0; i < data.tickers.length; i++){
                    if ( data.market_cap_rank !== null && data.tickers[i].target == 'USD') {
                        coinMeta.push({
                            rank:         data.market_cap_rank,
                            name:         data.name,
                            logo:         data.image.thumb,
                            trade_on:     data.tickers[i].trade_url,
                            vs_currency:  data.tickers[i].target,
                            price:        data.tickers[i].last,
                            creationDate: data.genesis_date,
                            ex_name:      data.tickers[i].market.name,
                            market_cap:   data.market_data.market_cap['usd'],
                            total_supply: data.circulating_supply
                        });
                        break;
                    }   
                }
            });
        });
        // add loader here
        await create_table();
    }

    //Dynamically create table rows based on coinMeta content
    let create_table = () => {
        $.when(ajaxCallObj[newCount])
            .then(()=>{
                allCoinsArray.push(coinMeta);
                sortByRank(allCoinsArray[0],"rank");
                for (var eachCoin = 0; eachCoin < newCount; eachCoin++){
                    if (allCoinsArray[0][eachCoin] != undefined) {
                        let 
                        rank         = allCoinsArray[0][eachCoin].rank,
                        name         = allCoinsArray[0][eachCoin].name,
                        price        = allCoinsArray[0][eachCoin].price,
                        logo         = allCoinsArray[0][eachCoin].logo,
                        origin_date  = allCoinsArray[0][eachCoin].creationDate,
                        currency     = allCoinsArray[0][eachCoin].vs_currency,
                        trade_on     = allCoinsArray[0][eachCoin].trade_on,
                        exchange     = allCoinsArray[0][eachCoin].ex_name,
                        market_cap   = allCoinsArray[0][eachCoin].market_cap,
                        total_supply = allCoinsArray[0][eachCoin].total_supply;

                        // Transform symbol with ternary operator, not convenient enough but it works.
                        currency == 'USD' ? currency = '$' : '';

                        output += 
                        `<tr class="coin-row">
                            <th scope="row" class="table-dark rank">${rank}</th>
                            <th scope="row" class="table-dark name-${name}" value="name"><img src="${logo}" class="coin-icon"/> ${name}</th>
                            <th scope="row" class="table-dark price">${currency} ${price}</th>
                            <th scope="row" class="table-dark creation-date">${origin_date != null ? origin_date : "N/A" }</th>
                            <th scope="row" class="table-dark market-cap">${currency} ${big_int_format(market_cap)}</th>
                            <th scope="row" class="table-dark trade-on">
                                <a href="${trade_on}" class="button" target="_blank">Trade on ${exchange}</a>
                            </th>
                        </tr>`; 
                    }
                }
            return $( ".price-list" ).append( output );
        });
    }
});
