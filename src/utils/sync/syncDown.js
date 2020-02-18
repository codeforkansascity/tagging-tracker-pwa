import axios from 'axios';

export const syncDown = (props) => {
    return new Promise(resolve => {
        const baseApiPath = window.location.href.indexOf('localhost') !== -1
            ? process.env.REACT_APP_API_BASE_LOCAL
            : process.env.REACT_APP_API_BASE;
        const postUrl = baseApiPath + '/sync-down';

        axios.post(postUrl, {
            headers: { Authorization: `Bearer ${props.token}` }
        }).then((res) => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                if (res.status === 403) {
                    alert("Your session has expired, please login again");
                    window.location.href = "/login"; // flush app state
                } else {
                    resolve(false);
                }
            }
        })
        .catch((err) => {
            console.log('sync err', err);
            
            if (typeof err.response !== "undefined" && typeof err.response.status !== "undefined" && typeof err.response.status === 403) {
                resolve({msg: 403});
            }

            resolve(false);
        });
    });
}