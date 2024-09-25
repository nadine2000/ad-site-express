const error = function(err){ return `<div class="container d-flex">
        <div class="card text-bg-danger">
            <div class="card-body">
                <h5 class="card-title"> UNEXPECTED ERROR:</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary"> ERROR:  ${err.name}, STATUS :${ err.status}  </h6>
                <p class="card-text"> <%= error.message %> </p> <br>
            </div>
        </div>
    </div>`}

const spinner =
    (function () {
        /**
         *  show the spinner and block page
         */
        const showSpinner = function() {
            let loadingOverlay = document.getElementById('spinner-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.remove('d-none');
                document.body.style.overflow = 'hidden';
            }
        };
        /**
         * remove the spinner from page
         */
        const removeSpinner = function() {
            let loadingOverlay = document.getElementById('spinner-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('d-none');
                document.body.style.overflow = 'visible';
            }
        };
        return {
            show: showSpinner,
            remove: removeSpinner
        }
    })();
/**
 * get all the posted ads from the model and
 * display them as cards
 */
const getAds = () => {
    spinner.show()
    fetch('/api/ads')
        .then((response) => {
            if (response.status !== 200)
                throw new Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            const dataElement = document.getElementById("ads")
            dataElement.innerHTML = data.map((item) => getCard(item.AdTitle, item.longDescription, item.price,
                item.phoneNumber, item.email,
                item.createdAt.slice(0, -5).replace('T', ', '), item.id)).join('');
        })
        .catch((err) => {
            console.log(err)
            document.getElementById("ads").innerHTML = error(err);
        })
        .finally(() => {
            spinner.remove();
        });
}

const onClickFunctions = (function () {
    
    
    /**
     * approve the card that the admin choose to approve
     * send the id of the ad to update it approved.
     * when the server returns success response show toast
     * that the ad approved.
     * @param event - click on the button approve
     */
    const approveAd = function (event) {
        const card = event.target.closest('.card');
        if (card) {
            spinner.show();
            const id = card.getElementsByClassName('list-group-item d-none')[0].textContent.trim();
            let adID = parseInt(id, 10);
            fetch(`/api/ads-approve/${adID}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"id": adID})
            })
                .then((res) => res.json())
                .then(() => {
                    const toastBootstrap = new bootstrap.Toast(document.getElementById('liveToast'));
                    toastBootstrap.show();
                    document.getElementById("ads").innerHTML = '';
                    getAds();
                }).catch((err) =>
            {
                console.log(err)
                document.getElementById("ads").innerHTML = error(err);
            })
                .finally(() => {
                    spinner.remove();
                });
        }
    }
    /**
     * delete the card that the admin choose to delete
     * send the id of the ad to delete it.
     * when the server returns success response show toast
     * that the deletion occurred. clear cards html and recall api for model data
     * to show it again
     * @param event - click on the button delete
     */
    const deleteAd = function (event) {
        const card = event.target.closest('.card');
        if (card) {
            const id = card.getElementsByClassName('list-group-item d-none')[0].textContent.trim();
            let adID = parseInt(id, 10);
            spinner.show();
            fetch(`/api/ads/${adID}`, {method: "DELETE"})
                .then(() => {
                    const toastBootstrap = new bootstrap.Toast(document.getElementById('liveToast1'));
                    toastBootstrap.show();
                    document.getElementById("ads").innerHTML = '';
                    getAds();
                }).catch((err) => {           
                    console.log(err)
                document.getElementById("ads").innerHTML = error(err);})
                .finally(() => {
                    spinner.remove();
                });
        }
    }
    return {
        approveAd: approveAd,
        deleteAd: deleteAd,
    }
})();

/**
 * get html syntax of the card
 * @param title - str ad title
 * @param des - str ad des
 * @param price - str ad  price
 * @param phone - str ad phone
 * @param email - str ad email
 * @param date- str ad submitted time
 * @returns {string} - html of the card
 */
const getCard = (title, des, price, phone, email, date, id) => {
    return `  <div class="col">
        <div class="card h-100">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"></li>
                <li class="list-group-item d-none">${id}</li>
                <li class="list-group-item"> <b> Descption:</b>   ${des}  </li>
                <li class="list-group-item"> <b> Price: </b> ${price} </li>
                <li class="list-group-item"> <b> Phone Number: </b> ${phone} </li>
                <li class="list-group-item"> <b> Email: </b> ${email} </li>
                <li class="list-group-item"> <b> Submitted In: </b> ${date} </li>
                <li class="list-group-item"></li>
            </ul>
            <button type="button" class="btn btn-secondary toast-btn" onclick="onClickFunctions.approveAd(event)"> approve </button>
            <button type="button" class="btn btn-secondary toast-btn" onclick="onClickFunctions.deleteAd(event)"> delete </button>
        </div></div></div>`

}

document.addEventListener('DOMContentLoaded',  () =>  getAds() , false);
