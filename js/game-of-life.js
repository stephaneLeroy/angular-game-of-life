/**
 * Angular.js GameOfLife Controller
 * Author: Stéphane LEROY
 * Twitter : @StphaneL
 * Date: 02/03/13
 * Time: 15:29
 */

function GameOfLifeCtrl($scope, $timeout) {

    // World initialisation
    function buildWorld(row, column) {
        var newWorld = [];
        for (var i=0; i< row; i++) {
            newWorld[i]=[];
            for(var j=0;j <column; j++) {
                newWorld[i].push({
                    isAlive: false,
                    posX: i,
                    posY: j
                });
            }
        }
        return newWorld;
    }

    // Reset the world
    $scope.reset = function() {
        $scope.world = buildWorld(16, 16);
    };
    // First, default world
    $scope.reset();

    // Toggle cell state (alive/dead)
    $scope.toggle = function(cell) {
        return cell.isAlive ? cell.isAlive = false : cell.isAlive = true;
    };

    // Internal function that check world boundaries against coordinates
    function checkWorldBoundaries(x,y) {
        return $scope.world[x] != null && $scope.world[y] != null;
    }

    // Return number of alive neighbours
    $scope.neighbours = function(cell) {
        var neighbours = 0;
        for(var i=-1;i<=1; i++) {
            for(var j=-1;j<=1; j++) {
                // Skip current cell
                if(i==0 && j==0) {
                    continue;
                }
                var x = cell.posX + i;
                var y = cell.posY + j;
                if(checkWorldBoundaries(x, y) && $scope.world[x][y].isAlive) {
                    neighbours++;
                }
            }
        }
        return neighbours;
    };

    function computeWorldRules(cell) {
        var neighbours = $scope.neighbours(cell);

        // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        if(neighbours<2) {
            return function() {
                cell.isAlive = false;
            }
        }
        // Any live cell with more than three live neighbours dies, as if by overcrowding.
        if(neighbours>3) {
            return function() {
                cell.isAlive = false;
            }
        }
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if(neighbours == 3 && !cell.isAlive) {
            return function() {
                cell.isAlive = true;
            }
        }
        return null;
    }

    // Compute the next step
    $scope.ruleTheWorld = function() {
        var rules=[];
        for (var i=0; i< $scope.world.length; i++) {
            for(var j=0;j <$scope.world[i].length; j++) {
                var rule = computeWorldRules($scope.world[i][j]);
                if(rule !=null) {
                    rules.push(rule);
                }
            }
        }

        for(i=0; i<rules.length; i++) {
               rules[i].apply(null);
        }
    };

    // State of 'auto-step' mode
    $scope.started = false;

    // One step
    var step = function () {
        if($scope.started) {
            $scope.ruleTheWorld();
        }
        $timeout(step, 300);
    };
    step();

    // start 'auto-step' mode
    $scope.start = function() {
        $scope.started = true;
    };

    // stop 'auto-step' mode
    $scope.stop = function() {
        $scope.started = false;
    };
}