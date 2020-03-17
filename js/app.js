/**
 * Function to ctreate HTML Node
 * @param {String} tag 
 * @param {Array} attrs 
 * @param {Array|String|null} inner 
 * 
 * @return {Node}
 */
const createHTMLNode = (tag, attrs, inner) => {
    const element = document.createElement(tag);
    attrs.map(el => {element.setAttribute(el.name, el.value.join(' '))});
    inner ? (Array.isArray(inner) ? inner.map(el => element.appendChild(el)) : element.innerHTML=inner) : null;
    return element;
};

const renderInApp = (htmlNode) => {
    document.getElementById('app').innerHTML = ''
    htmlNode.map(el => document.getElementById('app').appendChild(el));
}

const heroWrapper = () => {
    const heroSubTitleWrapper = createHTMLNode('div', [{name:'class', value:['hero__SubTitleWrapper']}], [
        createHTMLNode('h2',[{name:'class', value:['hero__SubTitle']}],'Hey, did you ever want to hold a Terry fold?'),
        createHTMLNode('h2',[{name:'class', value:['hero__HiddenSubTitle']}],'&nbsp I got one right here, grab my terry flap &nbsp'),
    ])
    const h1 = createHTMLNode('h1', [{name:'class', value:['hero__Title']}],'The Rick and Morty API')
    return createHTMLNode('section',[{name:'class', value:['hero__Wrapper']}],[h1,heroSubTitleWrapper])
}

const getCharacterCard = ({image,name,id,status,species,gender,origin,location}) => {
    const cardHeader = createHTMLNode('div',[{name:'class', value:['card','header']}], [
        createHTMLNode('div',[{name:'class', value:['card-image']}], [
            createHTMLNode('img',[{name:'src', value:[image]}],null)
        ]),
        createHTMLNode('div',[{name:'class', value:['characterCard__Title']}], [
            createHTMLNode('h2',[{name:'class', value:['characterCard__Name']}],name),
            createHTMLNode('p',[{name:'class', value:['characterCard__Description']}],`id: ${id} - created 2 years ago`),
        ]),
    ])

    const cardInfo = createHTMLNode('div',[{name:'class', value:['card','info']}],[{k:'STATUS',v:status},{k:'SPECIES',v:species},{k:'GENDER',v:gender},{k:'ORIGIN',v:origin.name},{k:'LAST LOCATION',v:location.name}].map(el => {
        return createHTMLNode('div',[{name:'class', value:['characterCard__TextWrapper']}],[
            createHTMLNode('span',[],el.k),
            createHTMLNode('p',[],el.v),
        ])
    }));

    return createHTMLNode('div',[{name:'class', value:['characterCard__Wrapper']}], [cardHeader,cardInfo])
}

const chartersWrapper = heros => {
    return createHTMLNode('section',[{name:'class', value:['showcase__Wrapper']}], [
        createHTMLNode('div',[{name:'class', value:['showcase__Inner']}], heros.map(hero => getCharacterCard(hero)))
    ])
}

const getCharacters = (amount) => {
    axios
        .get('https://rickandmortyapi.com/api/character')
        .then(response => {
            const count = response.data.info.pages;
            const links = [...new Array(count)].map((el,i) => `${url}/?page=${i+1}`);
            Promise.all(links.map(el => axios.get(el)))
                .then(response => {
                    const characters = ([...new Array(response.length)]
                        .map((el,i) => el = response[i].data.results))
                        .flat()
                        .reduce((arr, el) => (arr.splice(Math.random() * (arr.length + 1), 0, el), arr), []);
                        characters.length = amount;
                        renderInApp([heroWrapper(), chartersWrapper(characters)]);
                        document.getElementById('spinner').setAttribute("style", "display: none");
                })
                .catch(error => console.log('Error in all Promise', error));
        })
        .catch(error => console.log('Error in main Promise', error));
};

renderInApp([heroWrapper(), chartersWrapper([])]);

getCharacters(8);

