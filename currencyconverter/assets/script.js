document.querySelector('#zip').addEventListener('submit', getZipCode);

// Delete result
document.querySelector('body').addEventListener('click', deleteZipCodeInfo)


function getZipCode(e) {
    //get zip code from user input
    const zip = document.querySelector('.zip').value;

    fetch(`http://api.zippopotam.us/us/${zip}`)
        .then(res => {
            if(res.status != 200){
                show('remove');
                document.querySelector('#result').innerHTML =
               `
                <article class="message message-body is-danger">
                    <div class="message-body">
                        This code is invalid
                    </div>
                </article>

               `;
               throw Error(res.statusText);
            }
            else {
                show('check');
                return res.json();
            }
        })
            .then(data => {
                // show info
                let result = '';
                data.places.forEach(place => {
                    result += `
                        <article class="message is-primary">
                            <div class="message-header">
                                <p>Location Info</p>
                                <button class="delete"></button>
                            </div>
                            <div class="message-body">
                                <ul>
                                    <li>
                                        <strong>City: </strong>${place['place name']}
                                    </li>
                                    <li>
                                        <strong>State: </strong>${place['state']}
                                    </li>
                                    <li>
                                        <strong>Long.: </strong>${place['longitude']}
                                    </li>
                                    <li>
                                        <strong>Lat.: </strong>${place['latitude']}
                                    </li>
                                </ul>
                            </div>
                        </article>
                    `;
                });

                //put in div

                document.querySelector('#result').innerHTML = result;
        })
            .catch(err => console.error(err));

    e.preventDefault();
}

function show(icon) {
    //clear
    document.querySelector('.icon-remove').style.display = 'none';
    document.querySelector('.icon-check').style.display = 'none';

    //display
    document.querySelector(`.icon-${icon}`).style.display = 'inline-flex';
}

//Delete result info window

function deleteZipCodeInfo(e) {
    if(e.target.className == "delete"){
        document.querySelector('.message').style.display = "none";
        document.querySelector('.zip').value= '';
        document.querySelector('.icon-check').style.display = "none";
    }
}