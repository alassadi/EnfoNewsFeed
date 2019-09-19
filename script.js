// the API url 
const url = 'https://s3.eu-west-2.amazonaws.com/enfo-test-resources/api/articles.json';

// function to create the initial DOM elements
const DOMInit = () => {
    // get the root div element from index.html where we are going to create new DOM elements and append child nodes to it
    const app = document.getElementById('root')
    const container = document.createElement('div')
    container.setAttribute('class', 'container')
    app.appendChild(container)

    // creating a table that will contain the created UI and appending it to the container div node
    const table = document.createElement('table');
    table.setAttribute('id', 'cardsTable');
    container.appendChild(table);
}

// function for fetching the data using Fetch API 
const getData = (url) => {
    fetch(appendProxy(url))
        .then(responseHandler)
        .then(htmlBuilder)
        .catch(error => errorHandler(error));
}

// simple error handler
const errorHandler = (error) => {
    console.log('error', error);
}

// HTML DOM builder from the JSON data
const htmlBuilder = (response) => {
    // Begin accessing JSON data here and creating the cards dynamically through createCards function
    for (const article of JSON.parse(response).articles) {
        createCards(article.author, article.title, article.description, article.url, article.urlToImage, article.publishedAt);
    }
}

// simple function that reject a promise if an HTTP error status is returned
const responseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.text();
}

/* 
    Since the backend disabled CORS, and for the sake of testing,
    we used a proxy API (cors-anywhere) to which adds CORS headers to the proxied request
*/
// simple function to append a proxy to the given url
const appendProxy = (url) => {
    return 'https://cors-anywhere.herokuapp.com/' + url;
}

// simple function to reformat the publishedAt string into a yyyy-mm-dd HH:MM format 
const stringToDateTime = (publishedAt) => {
    return dateTime = publishedAt.substring(0, 4) + "-" + publishedAt.substring(4, 6) + "-" +
        publishedAt.substring(6, 8) + " " + publishedAt.substring(9, 11) + publishedAt.substring(11, publishedAt.length - 1);
}

// Function to build the UI cards in a table from the passed parameters
const createCards = (author, title, description, url, urlToImage, publishedAt) => {
    if (author == null) {
        author = " " // or not listed
    }
    output = `
        <tr>
            <td>
                <div class="blog-card alt">
                    <div class="meta">
                        <div class="photo" style="background-image: url(${urlToImage})">
                        </div>
                        <ul class="details">
                            <li class="author">${author}</li>
                            <li class="publishedAt">${stringToDateTime(publishedAt)}</li>
                        </ul>
                    </div>
                    <div class="description">
                        <h1>${title}</h1>
                        <p>${description}</p>
                        <p class="read-more">
                            <a href="${url}">Read More</a>
                        </p>
                    </div>
                </div>
            </td>
        </tr>             
    `
    document.getElementById('cardsTable').innerHTML += output;
}

// the search function that loop through table cells to find a match and hide other cells with no match
const searchFunction = () => {
    // Declare variables
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("cardsTable");
    tr = table.getElementsByTagName("tr");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Initiating the DOM
DOMInit();

// calling the getData function here
getData(url);