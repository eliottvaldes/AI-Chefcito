const app = Vue.createApp({
    data() {
        return {
            analysisResults: [],
            imageUrl: null,
            isBtnEnabled: false,
            page: 1,
            prompt: null,
            recipe: null,
        }
    },
    mounted() {

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
        verifyImage() {
            if (this.$refs.image.files.length > 0) {
                this.isBtnEnabled = true
            } else {
                this.isBtnEnabled = false
            }
        },
        async submitImage() {
            try {
                this.loadingData()

                let input = this.$refs.image
                let file = input.files[0]

                let formData = new FormData()
                formData.append('fileUpload', file)

                const enviroment = (window.location.hostname.includes('localhost'))
                    ? 'http://localhost:3000'
                    : 'https://ai-chefcito-production.up.railway.app';

                let { data } = await axios.put(`${enviroment}/api/images/upload`, formData)
                const { ok, msg, url } = data

                if (!ok) {
                    throw new Error(msg)
                }

                this.imageUrl = url
                this.page = 2
                this.isBtnEnabled = true
            } catch (error) {
                console.warn(error)
                this.isBtnEnabled = true
            }
        },
        selectImage() {
            this.page = 1
            this.imageUrl = null
            this.isBtnEnabled = false
            this.analysisResults = []
        },
        async analyzeImage() {
            try {
                this.loadingData()

                const body = {
                    image: this.imageUrl ?? 'https://sdfkjdsf.com'
                }

                const enviroment = (window.location.hostname.includes('localhost'))
                    ? 'http://localhost:3000'
                    : 'https://ai-chefcito-production.up.railway.app';

                let { data } = await axios.post(`${enviroment}/api/images/analyze`, body)
                const { msg, foodFound } = data

                this.analysisResults = this.getAnalysisResults(foodFound)
                this.page = 3

                this.isBtnEnabled = true
            } catch (error) {
                this.isBtnEnabled = true
            }
        },
        getAnalysisResults(ingredients) {
            const objects = ingredients.map((item) => {
                return item.object;
            });
            // remove duplicates
            return [...new Set(objects)];
        },
        async getRecipes() {
            try {
                this.loadingData()

                const body = {
                    ingredients: this.analysisResults
                }

                const enviroment = (window.location.hostname.includes('localhost'))
                    ? 'http://localhost:3000'
                    : 'https://ai-chefcito-production.up.railway.app';

                let { data } = await axios.post(`${enviroment}/api/recipes`, body)
                const { ok, msg, prompt, result } = data

                if (!ok) {
                    throw new Error(msg)
                }

                this.prompt = prompt
                this.recipe = result
                this.page = 4
                this.isBtnEnabled = true
            } catch (error) {
                console.warn(error)
                this.isBtnEnabled = true
            }

        },
        loadingData() {
            this.isBtnEnabled = false
            this.page = 'loader'
        },
        catchErrors(error) {
            const { status, data } = error.response;
            this.defineErrorsType(status);
            const errors = this.getErrors(data);
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
                errors.forEach((error) => {
                    errorsCaught.push(error.msg);
                });
            } else {
                errorsCaught.push(msg);
            }

            return errorsCaught;
        }

    },

}).mount('#app')