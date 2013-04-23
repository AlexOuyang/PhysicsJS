// newtonian gravity
Physics.behavior('newtonian', function( parent ){

    var defaults = {

        strength: 1
    };

    return {

        init: function( options ){

            // call parent init method
            parent.init.call(this, options);

            options = Physics.util.extend({}, defaults, options);

            this.strength = options.strength;
            this.tolerance = options.tolerance || 100 * this.strength;
        },
        
        behave: function( bodies, dt ){

            var body
                ,other
                ,strength = this.strength
                ,tolerance = this.tolerance
                ,scratch = Physics.scratchpad()
                ,pos = scratch.vector()
                ,normsq
                ,g
                ;

            for ( var j = 0, ll = bodies.length; j < ll; j++ ){
                
                body = bodies[ j ];

                for ( var i = j + 1, l = bodies.length; i < l; i++ ){
                    
                    other = bodies[ i ];
                    // clone the position
                    pos.clone( other.state.pos );
                    pos.vsub( body.state.pos );
                    // get the square distance
                    normsq = pos.normSq();

                    if (normsq > tolerance){

                        g = strength / normsq;

                        body.accelerate( pos.normalize().mult( g * other.mass ) );
                        other.accelerate( pos.mult( body.mass/other.mass ).negate() );
                    }
                }
            }

            scratch.done();
        }
    };
});
