jQuery(function () {
    'use strict'

    let output          = null,
        newCount        = null,
        coinID          = [],
        ajaxCallObj     = {},
        coinMeta        = [],
        allCoinsArray   = [];

    //Sort array by rank
    let sortByRank = (array, key) => {
        return array.sort((a, b) => {
            let x = a[key], 
                y = b[key];

            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

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
            let coinsLength = response.length,
                data        = response;

            return [...Array(coinsLength)].forEach((element, index) => {
                coinID.push( data[index].id );
            });
        },
        error: err => {
            console.log(err);
        },
    })
    .done(() => { 
        return getPrices(); 
    });


    //API call/s depending on the ammount of coin names set in coinID array. 
    //Upon success, ajax is building independent object called coinMeta.
    let getPrices = () => {
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
                for (var i=0; i< data.tickers.length; i++){
                    if ( data.market_cap_rank !== null && data.tickers[i].target == 'USD') {
                        coinMeta.push({
                            rank:           data.market_cap_rank,
                            name:           data.name,
                            logo:           data.image.thumb,
                            trade_on:       data.tickers[i].trade_url,
                            vs_currency:    data.tickers[i].target,
                            price:          data.tickers[i].last,
                            creationDate:   data.genesis_date,
                            ex_name:        data.tickers[i].market.name,
                        });                    
                        break;
                    }   
                }
            });
        });
        return createTable();
    } 

    //Dynamically create table rows
    let createTable = () => {
        $.when(ajaxCallObj[newCount])
            .then(()=>{
                allCoinsArray.push(coinMeta);
                sortByRank(allCoinsArray[0],"rank");
                for (var eachCoin = 0; eachCoin < newCount; eachCoin++){
                    if (allCoinsArray[0][eachCoin] != undefined) {
                        let rank        = allCoinsArray[0][eachCoin].rank,
                            name        = allCoinsArray[0][eachCoin].name,
                            price       = allCoinsArray[0][eachCoin].price,
                            logo        = allCoinsArray[0][eachCoin].logo,
                            origin_date = allCoinsArray[0][eachCoin].creationDate,
                            currency    = allCoinsArray[0][eachCoin].vs_currency,
                            trade_on    = allCoinsArray[0][eachCoin].trade_on,
                            exchange    = allCoinsArray[0][eachCoin].ex_name;
                        
                        output += 
                        `<tr class="coin-row">
                            <th scope="row" class="table-dark rank">${rank}</th>
                            <th scope="row" class="table-dark name-${name}" value="name"><img src="${logo}" class="coin-icon"/> ${name}</th>
                            <th scope="row" class="table-dark price">${currency} ${price}</th>
                            <th scope="row" class="table-dark creation-date">${origin_date != null ? origin_date : "N/A" }</th>
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
