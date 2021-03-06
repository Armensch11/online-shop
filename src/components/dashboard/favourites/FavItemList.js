import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import uniqId from 'uniqid';
import {useEffect} from 'react';
import {db} from '../../services/firebase/Firebase';
import FavItem from './FavItem';
import {makeStyles, useMediaQuery} from '@material-ui/core';
import {BLACK, BLUE} from "../../main/constants/constants";
import {useTranslation} from "react-i18next";
import Loader from "../../main/loader/Loader";
import {getError} from "../../services/redux/actions/uiActions";
import BackRouter from "../../main/BackRouter";

const useStyles = makeStyles({
    main: {
        marginTop: props => props ? 40 : 100,
    },
    favItems: {
        height: props => props ? 'calc(100vh - 330px)' : 'calc(100vh - 275px)',
        overflow: 'auto'
    },
    noFavourites: {
        textAlign: 'center',
        color: BLACK
    },
    emptyFavourites: {
        color: BLUE,
        textAlign: 'center'
    },
})
const FavItemList = () => {
    const [favItems, setFavItems] = useState([]);
    const [loader, setLoader] = useState(true);
    const favIds = useSelector(state => state.favourites);
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const media = useMediaQuery('(max-width:600px)')
    const classes = useStyles(media);


    useEffect(() => {
        getFavItems()
    }, [])

    function getFavItems() {
        try {
            if (favIds.length) {
                db.collection('product')
                    .where('id', 'in', favIds).get()
                    .then(querySnapshot => {
                        const tempArr = [];
                        querySnapshot.docs.forEach(doc => {
                            let tempObj = doc.data();
                            tempArr.push(tempObj)
                        })
                        setFavItems(tempArr)
                        setLoader(false)
                    }).catch(err => dispatch(getError(err.message)))
            } else {
                setLoader(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        loader ? <Loader/> : <div className={classes.main}>
            <BackRouter/>
            {favItems.length ? <div className={classes.favItems}>{favItems.map(data =>
                <FavItem key={uniqId()}
                         image={data?.images[0]}
                         model={data.model}
                         id={data.id}
                         price={data.price}
                         device={data.device}
                         favItems={favItems}
                         setFavItems={setFavItems}/>)}
            </div> : <h1 className={classes.emptyFavourites}>{t('youHaveNoFavourites')}</h1>}
        </div>
    )
}

export default FavItemList;
