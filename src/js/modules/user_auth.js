import { zlFetch } from "zl-fetch";

export class UserAuth {
    async signup (fields) {
        const response = await zlFetch.post('http://localhost:6700/api/v1/user/sign_up/', {
          auth: {
            fields
          },
          body: { /*...*/ }
        })
    }
}