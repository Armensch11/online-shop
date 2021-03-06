import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {db} from '../services/firebase/Firebase';
import uniqId from 'uniqid';
import {GREY, BLUE, ORANGE, MyButton} from '../main/constants/constants';
import {useHistory} from 'react-router-dom';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles({
    table: {
        width: 'auto',
        margin: "20px",
    },
    head: {
        border: `2px solid ${BLUE}`,
        backgroundColor: GREY,
        textAlign: 'center',
        fontSize: '18pt'
    },

    cells: {
        border: `2px solid ${BLUE}`,
        textAlign: 'center',
        color: ORANGE,
        fontSize: '14pt'
    },
    btn: {
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'end',
        margin: '20px'
    }
});

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const {t} = useTranslation()
    const history = useHistory();
    const classes = useStyles();

    function usersList() {
        db.collection('users').get()
            .then((Snapshot) => {
                const tempArr = [];
                Snapshot.forEach((doc) => {
                    tempArr.push({...doc.data()})

                });
                return setUsers([...tempArr])
            })
    }

    useEffect(() => {
        usersList();
    }, [])

    return (<div>
            <MyButton className={classes.btn}
                      variant="contained"
                      onClick={() => history.goBack()}>{t('goBack')}</MyButton>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow key={uniqId()}>
                        <TableCell key={uniqId()} className={classes.head}>FULLNAME</TableCell>
                        <TableCell key={uniqId()} className={classes.head}>E-MAIL</TableCell>
                        <TableCell key={uniqId()} className={classes.head}> ADDRESS</TableCell>
                        <TableCell key={uniqId()} className={classes.head}>ORDER PRICE</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={uniqId()}>
                            <TableCell key={uniqId()} className={classes.cells}>
                                {user.name ? (user.name + ' ' + user.surname) : '...'}
                            </TableCell>
                            <TableCell key={uniqId()} className={classes.cells}>{user.email}</TableCell>
                            <TableCell key={uniqId()} className={classes.cells}>{user.order?.address}</TableCell>
                            <TableCell key={uniqId()} className={classes.cells}>{user.order?.price}</TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>
        </div>
    );
}
