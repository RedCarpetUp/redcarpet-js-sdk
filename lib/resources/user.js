module.exports=function(api){
   return{ 
       setUserPersonalInfo :function ({ pincode, work, addressType, email, phone, accessToken }) {
        return api.callApi(
            "/set_personal_info",
            "POST",
            {
                pincode: pincode,
                occupation: work,
                address_type: addressType,
                email: email,
            },
            phone,
            accessToken
        );
    },

        getUserStatus : function ({ phone, accessToken }) {
        return api.callApi(
            `/user_products_and_states/${this.productType}`,
            "GET",
            {},
            phone,
            accessToken
        );
    }
    ,

    getUserCardDetails : function ({ phone, accessToken }) {
        return api.callApi(
            "/get_user_card_details",
            "GET",
            {},
            phone,
            accessToken
        );
    },

    getUserProfile :function ({ phone, accessToken }) {
        return api.callApi(
            "/get_new_user_profile",
            "GET",
            {},
            phone,
            accessToken
        );
    }

}
}