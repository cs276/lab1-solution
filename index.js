const API_KEY = "c1e87df0-b623-11e8-b9c8-a39304ff9948";

window.onload = () => {
  const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
  
  const hash = window.location.hash.slice(1);
  if (hash) {
    showObjectsTable(hash);
  }
  showGalleries(url);

  document.querySelector("#hide-objects").onclick = () => {
    document.querySelector("#all-galleries").style.display = "block";
    document.querySelector("#all-objects").style.display = "none";
    document.querySelector("#object-details").style.display = "none";
  }

  document.querySelector("#hide-object").onclick = () => {
    document.querySelector("#all-objects").style.display = "block";
    document.querySelector("#all-galleries").style.display = "none";
    document.querySelector("#object-details").style.display = "none";
  }

  document.querySelector("#search").onclick = handleSearch;
}

function showGalleries(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(gallery => {
      document.querySelector("#galleries").innerHTML += `
        <li>
          <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
          </a>
        </li>
      `;
    });
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}

function showObjectsTable(id) {
  document.querySelector("#objects").innerHTML = "";
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#object-details").style.display = "none";
  const url = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${id}`;
  showObjects(url);
}

function showObjects(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    data.records.forEach(object => {
      const people = object.people !== undefined ? object.people.map(person => person.name).join(", ") : "None Listed";
      document.querySelector("#objects").innerHTML += `
        <tr>
          <td>
            <a href="#" onclick="showObjectInfo('${object.objectnumber}')">
              ${object.title}
            </a>
          </td>
          <td><img class="gallery-image" src="${object.primaryimageurl}"></img></td>
          <td>${people}</td>
          <td><a href="${object.url}">See More</a></td>
        </tr>
      `;
    });
    if (data.info.next) {
      showObjects(data.info.next);
    }
  });
}

function handleSearch() {
  const query = document.querySelector("#search-field").value;
  document.querySelector("#objects").innerHTML = "";
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#object-details").style.display = "none";
  const url = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&title=${encodeURI(query)}&size=100`;
  showObjects(url); 
}

function showObjectInfo(objectNumber) {
  const url = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&objectnumber=${objectNumber}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    const object = data.records[0];
    console.log(object);
    document.querySelector("#object-details").style.display = "block";
    document.querySelector("#all-objects").style.display = "none";
    document.querySelector("#all-galleries").style.display = "none";
    document.querySelector("#object").innerHTML = `
      <ul>
        <li>Title: ${object.title}</li>
        <li>Description: ${object.description || "None"}</li>
        <li>Provenance: ${object.provenance || "None"}</li>
        <li>Accession Year: ${object.accessionyear}</li>
      </ul>
      <img src="${object.primaryimageurl}"></img> 
    `;
  });
}