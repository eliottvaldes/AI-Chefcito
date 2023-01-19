const app = Vue.createApp({
    data() {
        return {
            analysisResults: [],
            imageUrl: null,
            isBtnEnabled: false,
            page: 1,
            prompt: null,
            recipe: null,
            enviroment: null,
        }
    },
    mounted() {
        this.getEnviorment()
    },
    computed: {
        resultPrompt() {
            return this.prompt.split('\n')
        },
        resultRecipe() {
            return this.recipe.split('\n')
        },

    },
    methods: {
        getEnviorment() {
            this.enviroment = (window.location.hostname.includes('localhost'))
                ? 'http://localhost:3000'
                : 'https://ai-chefcito-production.up.railway.app'
        },
        verifyImage() {
            if (this.$refs.image.files.length > 0) {
                this.isBtnEnabled = true
            } else {
                this.isBtnEnabled = false
            }
        },
        async submitImage() {
            const currentPage = this.page
            try {
                this.loadingData()

                let input = this.$refs.image
                let file = input.files[0]

                let formData = new FormData()
                formData.append('fileUpload', file)               

                let { data } = await axios.put(`${this.enviroment}/api/images/upload`, formData)
                const { msg, url } = data

                this.imageUrl = url
                this.page = 2
            } catch (error) {
                this.catchErrors(error);
                this.page = currentPage
            }
            this.isBtnEnabled = true
        },
        selectImage() {
            this.page = 1
            this.imageUrl = null
            this.isBtnEnabled = false
            this.analysisResults = []
        },
        async analyzeImage() {
            const currentPage = this.page
            try {
                this.loadingData()

                const body = {
                    image: this.imageUrl
                }

                const { data } = await axios.post(`${this.enviroment}/api/images/analyze`, body)

                const { ok, msg, foodFound } = data
                if(!ok){
                    this.analysisResults = {}
                }else{                    
                    this.analysisResults = this.getAnalysisResults(foodFound)
                }
                this.page = 3

            } catch (error) {
                this.catchErrors(error);
                this.page = currentPage
            }
            this.isBtnEnabled = true
        },
        getAnalysisResults(ingredients) {
            const objects = ingredients.map((item) => {
                return item.object;
            });
            // remove duplicates
            return [...new Set(objects)];
        },
        async getRecipes() {
            const currentPage = this.page
            try {
                this.loadingData()

                const body = {
                    ingredients: this.analysisResults
                }
        
                let { data } = await axios.post(`${this.enviroment}/api/recipes`, body)
                const { msg, prompt, result } = data

                this.prompt = prompt
                this.recipe = result
                this.page = 4
            } catch (error) {
                this.catchErrors(error);
                this.page = currentPage
            }
            this.isBtnEnabled = true

        },
        loadingData() {
            this.isBtnEnabled = false
            this.page = 'loader'
        },
        catchErrors(error) {
            const { response } = error
            if (!response) {
                alert('ERROR IN CORS POLICY. Please try again later. If the problem persists, please contact the admin. ');
                return;
            }
            const { status, data } = response
            this.defineErrorsType(status)
            const errors = this.getErrors(data)
            console.log('ERRORS: ', errors)
        },
        defineErrorsType(statusCode) {

            if (statusCode >= 500) {
                console.log('ERROR IN SERVER')
                // TODO: show the error message and message to contact the admin
            } else {
                // TODO: show the error message
            }

        },
        getErrors(error) {
            let errorsCaught = [];
            const { msg } = error;
            if (!msg) {
                const { errors } = error;
                if (!errors) {
                    // error in axios request
                    errorsCaught.push('Error in during the request. Please try again later. If the problem persists, please contact the admin.');
                    return errorsCaught;
                }
                errors.forEach((error) => {
                    errorsCaught.push(error.msg);
                });
                return errorsCaught;
            }
            errorsCaught.push(msg);
            return errorsCaught;
        }

    },

}).mount('#app')