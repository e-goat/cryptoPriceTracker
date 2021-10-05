(function($){
    $(document).ready(()=>{
        getDailyPrices();
    });

    
    function getDailyPrices() {
        var coinID = ['bitcoin', 'ethereum', 'cardano', 'polkadot', 'dogecoin', 'shiba-inu', 'ripple','neo', 'stellar', 'solana'];
        $($(coinID).get().reverse()).each((index,id)=>{
            $.ajax({   
                url: `https://api.coingecko.com/api/v3/coins/${id}?tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true&days=1`,   
                dataType: "json",
                method: "GET",
                statusCode: {
                    404: function() {
                        alert('Page was not found!');
                    }
                },
                success: function(data) {
                    var dateOfCreation = '';
                    if (data.genesis_date !== null) {
                        dateOfCreation = data.genesis_date;
                    } else {
                        dateOfCreation = "Not available";
                    }
                    var metas = {
                        rank: data.market_cap_rank,
                        name: data.name,
                        logo: data.image.thumb,
                        vs_currency: data.tickers[i].target,
                        price: data.tickers[i].last,
                        creationDate: dateOfCreation
                   }
                   console.log(metas.rank)
                },
                error: function(err) {
                    console.log(err);
                }
            });
        });
    } 
      
    //   var output = "";
    //   var dateOfCreation = '';
    //   if (data.genesis_date !== null) {
    //       dateOfCreation = data.genesis_date;
    //   } else {
    //       dateOfCreation = "Not available";
    //   }
    //   for (var i=0; i< data.tickers.length; i++){
    //       // console.log(data.tickers[i].target);
    //       if ( data.market_cap_rank !== null && data.tickers[i].target == 'USD') {
    //           output +=`
    //               <tr class="coin-row">
    //                 <th scope="row" class="table-dark">${data.market_cap_rank}</th>
    //                 <th scope="row" class="table-dark ${data.name}-row"><img src="${data.image.thumb}" class="coin-icon"/> ${data.name}</th>
    //                 <th scope="row" class="table-dark">${data.tickers[i].target}</th>
    //                 <th scope="row" class="table-dark">${data.tickers[i].last}</th>
    //                 <th scope="row" class="table-dark">${dateOfCreation}</th>
    //               </tr>`;
    //           break;
    //       }
    //   }
    //   $(".price-list").slideDown(300, function () {
    //       $( this ).append( output );
    //   });
});
