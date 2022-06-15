jQuery(function () {
    'use strict'

    let output,
        coinMeta = [],
        allCoinsArray = [],
        ajaxCall = {},
        newCount = 0,
        coinID = [];

    //Sort array by rank
    function sortByRank(array, key) {
        return array.sort(function(a, b) {
            var x = a[key], 
                y = b[key];

            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/',
        dataType: 'json',
        method: 'GET',
        statusCode: {
            404: function() {
                alert('Error 404')
            }
        },
        data: {
            'Access-Control-Allow-Origin':'cors',
        },
        success: function(response) {
            let coinsLength = response.length;
            let data = response;

            return [...Array(coinsLength)].forEach((element, index) => {
                coinID.push( data[index].id );
            });
            // for ( var i = 0; i <= coinsLength - 1; i++ ) {
            //     coinID.push( data[i].id );
            // }
        },
        error: function(err) {
            console.log(err);
        },
    })
    .done( function() { 
        return getPrices(); 
    });


    //API call/s depending on the ammount of coin names set in coinID array. 
    //Upon success, ajax is building independent object called coinMeta.
    function getPrices() {
        $($(coinID).get().reverse()).each((_,id) => {
            ajaxCall[newCount] = $.ajax({   
                url: `https://api.coingecko.com/api/v3/coins/${id}?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true&days=1`,   
                dataType: "json",
                method: "GET",
                statusCode: {
                    404: function() {
                        alert('404 Error');
                    },
                },
                data: {
                    'Access-Control-Allow-Origin':'cors',
                },
                success: function(response) {
                    // console.log(response);
                },
                error: function(err) {
                    console.log(err);
                }
            }).done(function(data){
                newCount++
                for (var i=0; i< data.tickers.length; i++){
                    if ( data.market_cap_rank !== null && data.tickers[i].target == 'USD') {
                        coinMeta.push({
                            rank: data.market_cap_rank,
                            name: data.name,
                            logo: data.image.thumb,
                            vs_currency: data.tickers[i].target,
                            price: data.tickers[i].last,
                            creationDate: data.genesis_date
                        });                    
                        break;
                    }   
                }
            });
        });
        
        return createTable();
    } 

    //Dynamically create table rows
    function createTable() {
        $.when(ajaxCall[newCount])
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
                            currency    = allCoinsArray[0][eachCoin].vs_currency;
                        output += 
                        `<tr class="coin-row">
                            <th scope="row" class="table-dark rank">${rank}</th>
                            <th scope="row" class="table-dark name-${name}" value="name"><img src="${logo}" class="coin-icon"/> ${name}</th>
                            <th scope="row" class="table-dark price">$ ${price}</th>
                            <th scope="row" class="table-dark creation-date">${origin_date != null ? origin_date : "N/A" }</th>
                        </tr>`; 
                    }
                }
            return $( ".price-list" ).append( output );
        });
    }
});
