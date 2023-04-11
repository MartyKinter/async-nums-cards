$(function(){
    const baseURL = "https://pokeapi.co/api/v2";

    //#1
    $.getJSON(`${baseURL}/pokemone/?limit=1000`).then(data => {
        console.log(data);
    });

    //#2
    $.getJSON(`${baseURL}/pokemon/?Limit=1000`).then(data => {
        let randomPokeUrls = [];
        for (let i=0; i<3; i++){
            let randomIdx = Math.floor(Math.random() * data.results.length);
            let url = data.results.splice(randomIdx, 1)[0].url;
            randomPokeUrls.push(url);
        }
        return Promise.all(randomPokeUrls.map(url => $.getJSON(url)));
    }).then(pokemon => {
        pokemon.forEach(p => console.log(p));
    });

    //#3
    let names = null;
    $.getJSON(`${baseURL}/pokemon/?Limit=1000`).then(data => {
        let randomPokemonUrls = [];
        for (let i = 0; i < 3; i++) {
          let randomIdx = Math.floor(Math.random() * data.results.length);
          let url = data.results.splice(randomIdx, 1)[0].url;
          randomPokemonUrls.push(url);
        }
        return Promise.all(randomPokemonUrls.map(url => $.getJSON(url)));
     }).then(data => {
        names = data.map(d => d.name);
        return Promise.all(data.map(d => $.getJSON(d.species.url)));
     }).then(data => {
        let description = data.map(d =>{
            let descriptionObj = d.flavor_text_entries.find(
                entry => entry.language.name === "en"
            );
            return descriptionObj ? descriptionObj.flavor_text : "No description available.";
        });
        description.forEach((desc, i) => {
            console.log(`${names[i]}: ${desc}`);
        });
     });

     //#4
     let $btn = $("button");
     let $pokeContainer = $("#pokeContainer");

     $btn.on("click", function (){
        $pokeContainer.empty();
        let namesAndImgs = [];
        $.getJSON(`${baseURL}/pokemon/?Limit=1000`).then(data => {
            let randomPokeUrls = [];
            for (let i = 0; i < 3; i++) {
                let randomIdx = Math.floor(Math.random() * data.results.length);
                let url = data.results.splice(randomIdx, 1)[0].url;
                randomPokeUrls.push(url);
              }
              return Promise.all(randomPokeUrls.map(url => $.getJSON(url)));
        }).then(pokemonData => {
            namesAndImgs = pokemonData.map(p => ({
                name: p.name,
                imgSrc: p.sprites.front_default
            }));
            return Promise.all(pokemonData.map(p => $.getJSON(p.species.url)));
        }).then(speciesData => {
            speciesData.forEach((d, i) => {
                let descriptionObj = d.flavor_text_entries.find(function(entry){
                    return entry.language.name === "en";
                });
                let description = descriptionObj ? descriptionObj.flavor_text : "";
                let {name, imgSrc} = namesAndImgs[i];
                $pokeContainer.append(makePokeCard(name, imgSrc, description));
            });
        });
     });

     function makePokeCard(name, imgSrc, description){
        return `
            <div class="card">
            <h1>${name}</h1>
            <img src=${imgSrc} />
            <p>${description}</p>
            </div>`;
     }
});