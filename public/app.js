const app = Vue.createApp({
    data() {
        return {
            analysisResults: {},
            imageUrl: null,
            isBtnEnabled: false,
            page: 'initial',
            /* 
            // test data
            imageUrl: "https://res.cloudinary.com/drplgwglb/image/upload/v1704979133/jvesfy10xjrzvjelgbep.jpg",
            isBtnEnabled: true,
            page: 2, 
            */
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
                    mealTime: 'no-preference',
                    cuisine: 'no-preference',
                    diet: [],
                    mealType: 'no-preference',
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
                    mealTime: [
                        'no-preference', 'breakfast', 'lunch', 'dinner', 'snack', 'teatime'
                    ],
                    cuisine: [
                        'no-preference', 'african', 'american', 'british', 'cajun', 'chinese', 'french', 'german', 'greek', 'indian', 'irish', 'italian', 'jewish', 'japanese', 'korean', 'mexican', 'middle eastern', 'nordic', 'southern', 'spanish', 'thai', 'vietnamese'
                    ],
                    diet: [
                        'no-preference', 'balanced', 'high-protein', 'high-fiber', 'low-fat', 'low-carb', 'low-sodium', 'low-sugar'
                    ],
                    mealType: [
                        'no-preference', 'main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink'
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
                        'no-preference', 'oven', 'blender', 'microwave', 'toaster', 'grill', 'griddle',
                        'fryer', 'pressure cooker', 'slow cooker', 'food processor', 'juicer', 'spiralizer', 'coffee maker',
                        'waffle maker', 'ice cream maker', 'stand mixer', 'hand mixer', 'food dehydrator', 'food scale',
                        'measuring cups', 'measuring spoons', 'thermometer', 'colander', 'strainer', 'spatula', 'whisk',
                        'peeler', 'can opener', 'bottle opener', 'corkscrew', 'ladle', 'tongs', 'masher', 'grater', 'zester',
                        'sieve', 'chopper', 'slicer', 'knife', 'cutting board'
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
            const diet = this.recipePreferences.preferences.diet
            if (diet.length > 0) {
                if (diet.includes('no-preference')) {
                    this.recipePreferences.preferences.diet = ['no-preference']
                }
            }
        },
        validateRecipePreferencesKitchenResources() {
            const kitchenResources = this.recipePreferences.kitchenForniture.kitchenResources
            if (kitchenResources.length > 0) {
                if (kitchenResources.includes('no-preference')) {
                    this.recipePreferences.kitchenForniture.kitchenResources = ['no-preference']
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
                                if (val === 'no-preference') {
                                    delete obj[key][key2]
                                }
                            });
                            continue
                        }
                        if (value2 === 'no-preference' || !value2 || value2.length < 1) {
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