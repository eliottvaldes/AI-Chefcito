const app = Vue.createApp({
    data() {
        return {
            analysisResults: {},
            imageUrl: null,
            isBtnEnabled: false,
            page: 'initial',

            /* // test data
            imageUrl: "https://res.cloudinary.com/drplgwglb/image/upload/v1713248403/o7cmjhn1tki2v89puzjz.jpg",
            isBtnEnabled: true,
            page: 3,
            analysisResults: {
                description: "Red apple with white background",
                ingredients: [
                    "apple"
                ],
            }, */

            prompt: null,
            recipe: null,
            enviroment: null,
            recipeType: 'basic',
            showCustomizations: false,
            showMoreCustomizations: false,
            recipePreferences: {},
            mealOptions: {},
        }
    },
    mounted() {
        this.getEnviorment()
        this.mealOptions = this.getMealOptions()
        this.recipePreferences = this.getRecipePreferences()
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
                : `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
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
                let { msg, url } = data

                this.createAlerts('success', [msg])
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
                console.log(data)

                let { ok, msg, imgDescription, foodFound } = data

                const ingredients = this.getAnalysisResults(foodFound);
                if (ingredients.length < 1) {
                    ok = false;
                }

                if (!ok) {
                    this.analysisResults = {}
                } else {
                    this.analysisResults = {
                        ingredients,
                        description: imgDescription
                    }
                }

                let alertStatus = (ok) ? 'success' : 'error'
                this.createAlerts(alertStatus, [msg])
                this.page = 3

            } catch (error) {
                this.catchErrors(error);
                this.page = currentPage
            }
            this.isBtnEnabled = true
        },
        async analyzeImageOpenIA() {
            const currentPage = this.page
            try {
                this.loadingData()

                const body = {
                    image: this.imageUrl
                }

                const { data } = await axios.post(`${this.enviroment}/api/images/analyze-openai`, body)

                console.log(data)

                let { ok, msg, imgDescription, foodFound } = data

                const ingredients = foodFound ?? [];
                if (ingredients.length < 1) {
                    ok = false;
                }

                const description = imgDescription ?? '';
                if (description.length < 1) {
                    ok = false;
                }

                if (!ok) {
                    this.analysisResults = {}
                } else {
                    this.analysisResults = {
                        ingredients,
                        description,
                        data
                    }
                }

                let alertStatus = (ok) ? 'success' : 'error'
                this.createAlerts(alertStatus, [msg])
                this.page = 3

            } catch (error) {
                this.catchErrors(error);
                this.page = currentPage
            }
            this.isBtnEnabled = true
        },
        getAnalysisResults(ingredients) {
            const invalidResults = ['Food', 'Fruit', 'Vegetables']
            if (!ingredients) {
                return [];
            }
            const objects = ingredients.map((item) => {
                return item.object;
            });
            // remove duplicates
            let ingredientsFound = [...new Set(objects)];
            // remove invalid results
            ingredientsFound = ingredientsFound.filter((item) => {
                return !invalidResults.includes(item);
            });

            return ingredientsFound;
        },
        async getRecipes() {
            const currentPage = this.page
            try {
                this.loadingData()

                let urlEndPoint = `${this.enviroment}/api/recipes`

                const body = {
                    ingredients: this.analysisResults.ingredients
                }

                if (this.recipeType === 'custom') {
                    const isValidPreferenceConfig = this.validateRecipePreferences()
                    if (isValidPreferenceConfig) {
                        body.customizations = this.recipePreferences
                        urlEndPoint += '/custom'
                    } else {
                        alert('You dont have recipe customization, youll get a basic recipe')
                    }
                }

                let { data } = await axios.post(urlEndPoint, body)
                const { msg, prompt, result } = data

                this.createAlerts('success', [msg])
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
            this.createAlerts('error', errors)
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
        },
        createAlerts(icon, data) {

            const title = (icon != 'error') ? 'Success!' : 'Ups!';

            let html = '';
            data.forEach((msg) => {
                html += `<li>${msg}</li>`;
            });

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon,
                title,
                html,
            })

        },

        // recipe methods       
        getRecipePreferences() {
            return {
                preferences: {
                    HoraDeComida: 'sin-preferencia',
                    Cocina: 'sin-preferencia',
                    Dieta: [],
                    TipoDeComida: 'sin-preferencia',
                },
                preparationTime: {},
                nutrition: {},
                kitchenForniture: {},
                diners: 1,
            }
        },
        getMealOptions() {
            return {
                preferences: {
                    HoraDeComida: [
                        'sin-preferencia', 'desayuno', 'almuerzo', 'cena', 'bocadillo', 'hora del té'
                    ],
                    Cocina: [
                        'sin-preferencia', 'africana', 'americana', 'británica', 'cajun', 'china', 'francesa', 'alemana', 'griega', 'india', 'irlandesa', 'italiana', 'judía', 'japonesa', 'coreana', 'mexicana', 'del-medio-oriente', 'nórdica', 'sureña', 'española', 'tailandesa', 'vietnamita'
                    ],
                    Dieta: [
                        'sin-preferencia', 'equilibrada', 'alta en proteínas', 'alta en fibra', 'baja en grasas', 'baja en carbohidratos', 'baja en sodio', 'baja en azúcar'
                    ],
                    TipoDeComida: [
                        'sin preferencia', 'plato principal', 'acompañamiento', 'postre', 'aperitivo', 'ensalada', 'pan', 'desayuno', 'sopa', 'bebida', 'salsa', 'marinado', 'bocadito', 'bocadillo', 'trago'
                    ],
                },
                preparationTime: {
                    minReadyTime: 0,
                    maxReadyTime: 0,
                    minCookTime: 0,
                    maxCookTime: 0,
                    minPrepTime: 0,
                    maxPrepTime: 0,
                    minTotalTime: 0,
                    maxTotalTime: 0,
                },
                nutrition: {
                    minCarbs: 0,
                    maxCarbs: 0,
                    minFat: 0,
                    maxFat: 0,
                    minProtein: 0,
                    maxProtein: 0,
                    minSugar: 0,
                    maxSugar: 0,
                    minCalories: 0,
                    maxCalories: 0,
                },
                kitchenForniture: {
                    kitchenResources: [
                        'sin-preferencia', 'horno', 'licuadora', 'microondas', 'tostadora', 'parrilla', 'plancha',
                        'freidora', 'olla a presión', 'olla de cocción lenta', 'procesador de alimentos', 'exprimidor', 'espiralizador', 'cafetera',
                        'máquina para hacer waffles', 'máquina para hacer helados', 'batidora de pedestal', 'batidora de mano', 'deshidratador de alimentos', 'balanza de cocina',
                        'tazas medidoras', 'cucharas medidoras', 'termómetro', 'colador', 'estameña', 'espátula', 'batidor',
                        'pelador', 'abrelatas', 'abrebotellas', 'sacacorchos', 'cucharón', 'tenazas', 'machacador', 'rallador', 'rallador de cítricos',
                        'tamiz', 'picador', 'rebanador', 'cuchillo', 'tabla de cortar'
                    ]

                },
                diners: 1,
            }
        },
        removeRecipePreferences() {
            this.recipePreferences = this.getRecipePreferences()
        },
        saveRecipePreferences() {
            // validate recipe preferences
            this.validateRecipePreferencesDiet()
            this.validateRecipePreferencesKitchenResources()
            // save recipe preferences in session storage
            localStorage.setItem('recipePreferences', JSON.stringify(this.recipePreferences))

        },
        toggleShowCustomizations() {
            this.showCustomizations = !this.showCustomizations
        },
        validateRecipePreferencesDiet() {
            const diet = this.recipePreferences.preferences.Dieta
            if (diet.length > 0) {
                if (diet.includes('sin-preferencia')) {
                    this.recipePreferences.preferences.Dieta = ['sin-preferencia']
                }
            }
        },
        validateRecipePreferencesKitchenResources() {
            const kitchenResources = this.recipePreferences.kitchenForniture.kitchenResources
            if (kitchenResources.length > 0) {
                if (kitchenResources.includes('sin-preferencia')) {
                    this.recipePreferences.kitchenForniture.kitchenResources = ['sin-preferencia']
                }
            }
        },
        validateRecipePreferences() {
            let obj = JSON.stringify({ ...this.recipePreferences })
            const localObj = this.clearRecipePreferences(JSON.parse(obj))
            let isValidPreference = false
            for (let key in localObj) {
                if (localObj.hasOwnProperty(key)) {
                    isValidPreference = true
                }
            }
            return isValidPreference
        },
        clearRecipePreferences: (obj) => {
            for (let [key, value] of Object.entries(obj)) {
                if (typeof value === 'object') {
                    // get the elemts of the object and validate if they are 
                    for (let [key2, value2] of Object.entries(value)) {
                        if (Array.isArray(value2)) {
                            if (value2.length == 0) {
                                delete obj[key][key2]
                                continue
                            }
                            value2.forEach((val) => {
                                if (val === 'sin-preferencia') {
                                    delete obj[key][key2]
                                }
                            });
                            continue
                        }
                        if (value2 === 'sin-preferencia' || !value2 || value2.length < 1) {
                            delete obj[key][key2]
                        }
                    }
                    if (Object.keys(value).length < 1) {
                        delete obj[key]
                    }
                    continue;
                }

                if (value == 1) {
                    delete obj[key]
                }

            }

            return obj;
        },

    },

}).mount('#app')