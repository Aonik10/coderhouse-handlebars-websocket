const socketClient = io();

const form = document.getElementById("form");
const title = document.getElementById("title");
const description = document.getElementById("description");
const code = document.getElementById("code");
const price = document.getElementById("price");
const category = document.getElementById("category");
const thumbnails = document.getElementById("thumbnails");
const productsRows = document.getElementById("products-data");

form.onsubmit = (e) => {
    e.preventDefault();
    const newProduct = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        category: category.value,
        thumbnails: thumbnails.value,
    };
    console.log("enviando nuevo producto desde el front");
    socketClient.emit("createProduct", newProduct);
};

socketClient.on("getAllProducts", (products) => {
    let newProductRows = '<tbody id="products-data">';
    products.map((prod) => {
        newProductRows += `<tr><td class="p-0">${prod.id}</td>`;
        newProductRows += `<td class="p-0">${prod.title}</td>`;
        newProductRows += `<td class="p-0">${prod.description}</td>`;
        newProductRows += `<td class="p-0">${prod.code}</td>`;
        newProductRows += `<td class="p-0">${prod.price}</td>`;
        newProductRows += `<td class="p-0">${prod.category}</td>`;
        newProductRows += `<td class="p-0">${prod.thumbnails}</td></tr>`;
    });
    newProductRows += "</tbody>";
    productsRows.innerHTML = newProductRows;
});
