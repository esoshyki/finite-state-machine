class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        const err = new Error('Config isn\'t pass')
        if (!config) throw err
        this._config = config;
        this._state = this._config.initial;
        this._undo = [];
        this._redo = [];
    }
        
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._state
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        const err = new Error('State isn\'t exists')
        if (!this._config.states[state] ) throw err;
        this._undo.push(this._state);
        this._redo = [];
        this._state = state;
    }
        
    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const state = this.getState();
        const err = new Error('trigger doesn\'t exists');
        const ev =  this._config['states'][state]['transitions'][event];
        if (!ev) throw err
        this._state = ev;
        this._undo.push(state);
        this._redo = [];
    }
        
    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._state = this._config.initial
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const states = Object.keys(this._config.states);
        if (!event) return states
        const ans = states.filter(el => Object.keys(this._config.states[el].transitions).indexOf(event.toString()) > -1)
        return ans
    }
        
    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this._undo.length) return false;
        const state = this._undo.pop();
        this._redo.push(this._state)
        this._state = state;
        return true
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this._redo.length) return false;
        const state = this._redo.pop();
        this._undo.push(this._state);
        console.log(`redo this.state = ${this._state}`)
        this._state = state
        return true
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._state = this._config.initial;
        this._undo = [];
        this._redo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
