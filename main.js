$(document).ready(function () {
    getDailyPrices(); 
    createTable(); 
});
var output;
var dateOfCreation = '';
let coinMetas = [];
let allCoinsArray = [];
var ajaxCalls = {};
let newCount = 0;

const coinID = ['bitcoin', 'ethereum', 'cardano', 'polkadot', 'dogecoin', 'shiba-inu', 'ripple','neo', 'stellar', 'solana'];

function getDailyPrices() {
    let request;
    $($(coinID).get().reverse()).each((index,id)=>{
        newCount++
        ajaxCalls[newCount] = $.ajax({   
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
            if (data.genesis_date !== null) {
                dateOfCreation = data.genesis_date;
            } else {
                dateOfCreation = "Not available";
            }
            
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
} 

function createTable() {
    console.log(newCount)
    $.when(ajaxCalls[10]).done(()=>{
        allCoinsArray.push(coinMetas);
        sortByKey(allCoinsArray[0],"rank")
        for (var eachCoin = 0; eachCoin < newCount; eachCoin++){
            output +=`
            <tr class="coin-row">
              <th scope="row" class="table-dark">${allCoinsArray[0][eachCoin].rank}</th>
              <th scope="row" class="table-dark ${allCoinsArray[0][eachCoin].name}-row"><img src="${allCoinsArray[0][eachCoin].logo}" class="coin-icon"/> ${allCoinsArray[0][eachCoin].name}</th>
              <th scope="row" class="table-dark">$ ${allCoinsArray[0][eachCoin].price}</th>
              <th scope="row" class="table-dark">${allCoinsArray[0][eachCoin].creationDate ? allCoinsArray[0][eachCoin].creationDate : "N/A" }</th>
            </tr>`;  
          
        }
        $(".price-list").slideDown(300, function () {
            $( this ).append( output );
        });
    });
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}