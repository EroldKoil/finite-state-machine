class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.states =
            {
                normal: {
                    name:'normal',
                    transitions: {
                        study: 'busy',
                    }
                },
                busy: {
                    name:'busy',
                    transitions: {
                        get_tired: 'sleeping',
                        get_hungry: 'hungry',
                    }
                },
                hungry: {
                    name:'hungry',
                    transitions: {
                        eat: 'normal'
                    },
                },
                sleeping: {
                    name:'sleeping',
                    transitions: {
                        get_hungry: 'hungry',
                        get_up: 'normal',
                    },
                },
                events: {
                    study: ['normal'],
                    get_tired: ['busy'],
                    get_hungry: ['busy' ,'sleeping' ],
                    eat: ["hungry"],
                    get_up: ["sleeping"],
                },
            };
        this.history =[];
        this.historyCount=-1;
        this.changeState(config.initial);
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state.name;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state , needPush) {
        let newState = this.states[state];
        if(newState != undefined) {
            this.state = newState;
        }
        else{
            throw new Error('Error');
            return;
        }
        if(needPush != true){
            let hC = this.historyCount;
            let hL = this.history.length;
            if (hC<hL-1){
                this.history.splice(hC+1, hL-hC-1);
            }
            this.history.push(this.state.name);
            this.historyCount = this.history.length-1;
        }
    }


    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let newState = this.state.transitions[event];
        if(newState==undefined){
            throw new Error('Error');
        }
        else{
            this.changeState(newState);
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState("normal");
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if(event==undefined){
            return ['normal', 'busy', 'hungry', 'sleeping'];
        }
        else {
            let newState = this.states.events[event];
            if (newState == undefined) {
                return [];
            }
            else {
                return newState;
            }
        }

    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.historyCount>0){
            this.changeState(this.history[--this.historyCount],true);
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.historyCount<this.history.length-1){
            this.changeState(this.history[++this.historyCount],true);
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history=[];
        this.historyCount = -1;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
