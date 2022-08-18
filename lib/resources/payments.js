module.exports = function (api) {
return{
    getOtp({ phone }) {
        return api.callApi(
            "/user_mobile_signup",
            "GET",
            {
                mobile: phone,
                resource_id: this.resourceId,
            },
            phone
        );
    }
}
}
