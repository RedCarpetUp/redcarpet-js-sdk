
module.exports=function(api){
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
,
     verifyOtp :async function ({ otp, phone }) {
        const response = await api.callApi(
            "/user_mobile_verify",
            "GET",
            {
                mobile: phone,
                code: otp,
                resource_id: this.resourceId,
            },
            phone
        );
        if (response.result === "success") {
            await api.callApi(
                "/set_branch_data",
                "POST",
                { skipReferral: true, utm_medium: this.productType },
                phone,
                response.access_token
            );
            return response;
        } else {
      
            throw new Error(response.message);
        }
    }
}
}