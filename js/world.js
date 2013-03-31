/**
 * Angular.js GameOfLife world provider
 * Author: Stéphane LEROY
 * Twitter : @StphaneL
 * Date: 09/03/13
 * Time: 10:09
 */

angular.module('WorldProvider', []).
    factory('World', function(){
        function checkWorldBoundaries(world, x, y) {
            return world[x] != null && world[y] != null;
        };
        function buildCell(world, x, y) {
             return {
                 'world': world,
                 'isAlive': false,
                 'posX': x,
                 'posY': y,
                 'toggle': function() {
                     this.isAlive ? this.isAlive = false : this.isAlive = true;
                 },
                 'kill' : function() {
                     this.isAlive = false;
                 },
                 'born' : function() {
                     this.isAlive = true;
                 },
                 'neighbours': function() {
                    var neighbours = 0;
                        for(var i=-1;i<=1; i++) {
                            for(var j=-1;j<=1; j++) {
                                // Skip current cell
                                if(i==0 && j==0) {
                                    continue;
                                }
                                var x = this.posX + i;
                                var y = this.posY + j;
                                if(checkWorldBoundaries(this.world, x, y) && this.world[x][y].isAlive) {
                                    neighbours++;
                                }
                            }
                        }
                    return neighbours;
                }
            }
        };
        function buildWorld(row, column) {
            var newWorld = [];
            for (var i=0; i< row; i++) {
                newWorld[i]=[];
                for(var j=0;j <column; j++) {
                    newWorld[i].push(buildCell(newWorld,i,j));
                }
            }
            return newWorld;
        };

        return {
            'world': buildWorld(12,12),
            'nbRows': function() {
                    return this.world.length;
            },
            'nbColumns': function() {
                if(this.world.length > 0) {
                    return this.world[0].length;
                } else {
                    return 0;
                }
            },
            'visit': function(visitor) {
                var result=[];
                for (var x=0; x< this.world.length; x++) {
                    for(var y=0;y <this.world[x].length; y++) {
                        var rule = visitor.call(this, this.world[x][y]);
                        if(rule != null) {
                            result.push(rule);
                        }
                    }
                }
                return result;
            },
            'reset': function() {
                this.visit(function(cell) {cell.isAlive = false})
            },
            'addColumn': function() {
                for (var x=0; x< this.world.length; x++) {
                    this.world[x].push(buildCell(this.world,x,this.world[x].length))
                }
            },
            'removeColumn': function() {
                for (var x=0; x< this.world.length; x++) {
                    this.world[x].pop();
                }
            },
            'addRow': function() {
                var newRow = [];
                for (var x=0; x< this.world[0].length; x++) {
                    newRow.push(buildCell(this.world,x,this.world.length))
                }
                this.world.push(newRow);
            },
            'removeRow': function() {
                this.world.pop();
            }
        };
    });