export default function (state, action) {
    switch(action.type) {
        case 'SET_SEARCH_FILTER':
            state.filter = action.value
            return Object.assign({}, state)
    }
    return state
}
