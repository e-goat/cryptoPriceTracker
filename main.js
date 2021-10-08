jQuery(function () {
    getDailyPrices();
    // createTable(); 
});

var output;
var dateOfCreation = '';
let coinMetas = [];
let allCoinsArray = [];
var ajaxCall = {};
let newCount = 0;

const coinID = 
[
'bitcoin', 
'ethereum', 
'cardano', 
'polkadot', 
'dogecoin', 
'shiba-inu', 
'ripple', 
'neo', 
'stellar', 
'solana',
'zcash',
'umi',
'dash',
'iota',
'tezos',
'uniswap'
];

//API call/s depending on the ammount of coin names set in coinID array. 
//Upon success, ajax is building independent object called coinMetas.
function getDailyPrices() {
    $($(coinID).get().reverse()).each((index,id)=>{
        ajaxCall[newCount] = $.ajax({   
            url: `https://api.coingecko.com/api/v3/coins/${id}?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true&days=1`,   
            dataType: "json",
            method: "GET",
            statusCode: {
                404: function() {
                    alert('Page was not found!');
                }
            },
            error: function(err) {
                console.log(err);
            }
        }).done(function(data){
            newCount++
            console.log(newCount + ': ' + 'data for each api call');
            console.log(data);
            for (var i=0; i< data.tickers.length; i++){
                if ( data.market_cap_rank !== null && data.tickers[i].target == 'USD') {
                    coinMetas.push({
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

//Sort the price list by rank sequence
function sortByRank(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

//Dynamically create table rows
function createTable(value, index) {
    $.when(ajaxCall[newCount]).done(()=>{
        console.log('counter after all successful ajax calls is ' + newCount);

        // console.log('final ajax call is done');
    }).then(()=>{
        allCoinsArray.push(coinMetas);
        sortByRank(allCoinsArray[0],"rank");
        for (var eachCoin = 0; eachCoin < newCount; eachCoin++){
            output +=`
            <tr class="coin-row">
              <th scope="row" class="table-dark">${allCoinsArray[0][eachCoin].rank}</th>
              <th scope="row" class="table-dark row-${allCoinsArray[0][eachCoin].name}" value="${allCoinsArray[0][eachCoin].name}"><img src="${allCoinsArray[0][eachCoin].logo}" class="coin-icon"/> ${allCoinsArray[0][eachCoin].name}</th>
              <th scope="row" class="table-dark">$ ${allCoinsArray[0][eachCoin].price}</th>
              <th scope="row" class="table-dark">${allCoinsArray[0][eachCoin].creationDate ? allCoinsArray[0][eachCoin].creationDate : "N/A" }</th>
            </tr>`;  
          
        }

        $( ".price-list" ).append( output );
    });
}
