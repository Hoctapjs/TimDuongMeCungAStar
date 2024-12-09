document.getElementById('settings-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var rowValue = parseInt(document.getElementById('row').value);
    var columnValue = parseInt(document.getElementById('column').value);

    document.documentElement.style.setProperty('--row', rowValue);
    document.documentElement.style.setProperty('--column', columnValue);

    var container = document.getElementById('container');
    container.innerHTML = ''; // Xóa nội dung hiện tại của container


    var maze = Array.from({ length: rowValue }, () => Array(columnValue).fill(0));
    // tạo mảng maze (mê cung) 2 chiều
    // Array.from() là một phương thức tạo ra một mảng mới từ một đối tượng giống mảng
    // Đối tượng { length: rowValue } là một đối tượng có thuộc tính length. Điều này báo cho Array.from() biết mảng cần có bao nhiêu phần tử.
    // Vì không có giá trị cụ thể nào được cung cấp, các phần tử trong mảng sẽ ban đầu là undefined.
    // () => Array(columnValue).fill(0)
    // Phần này là một hàm (được gọi là arrow function) được gọi cho mỗi phần tử trong mảng được tạo ra ở phần đầu tiên.
    // Array(columnValue): Tạo một mảng mới với độ dài bằng columnValue
    // mỗi phần tử trong mảng đầu tiên sẽ là một mảng 1 chiều
    // .fill(0): Lấp đầy tất cả các phần tử trong mảng với giá trị 0. Điều này có nghĩa là mỗi phần tử trong mảng hàng sẽ là 0.
    // Tổng Hợp
    // Array.from({ length: rowValue }, () => Array(columnValue).fill(0)) tạo ra một mảng có rowValue hàng.
    // Mỗi hàng là một mảng có columnValue cột, và mỗi phần tử trong cột được khởi tạo bằng 0.
    /* Biến maze là một mảng hai chiều (một mảng chứa các mảng con).
    Nó có rowValue hàng và columnValue cột.
    Mỗi ô trong mảng hai chiều này ban đầu được đặt thành 0. */


    var visited = Array.from({ length: rowValue }, () => Array(columnValue).fill(false));
    /*rowValue: Đại diện cho số hàng trong mảng.
    columnValue: Đại diện cho số cột trong mảng.*/
    /* Array.from({ length: rowValue }):
    Phần này tạo ra một mảng có độ dài bằng rowValue.
    Array.from() là một phương thức để tạo một mảng mới từ một đối tượng có thể lặp hoặc có thuộc tính length.
    { length: rowValue } là một đối tượng có thuộc tính length được đặt bằng giá trị rowValue,
    cho biết số phần tử trong mảng. */

    /*() => Array(columnValue).fill(false):
    Đây là một hàm (arrow function) được gọi cho mỗi phần tử trong mảng vừa được tạo ra.
    Array(columnValue): Tạo một mảng mới với độ dài bằng columnValue.
    .fill(false): Lấp đầy tất cả các phần tử trong mảng với giá trị false.
    Điều này có nghĩa là mỗi phần tử trong mảng con (hàng) sẽ được đặt giá trị là false.*/

    /*Array.from({ length: rowValue }, () => Array(columnValue).fill(false)) tạo ra một mảng có rowValue hàng.
    Mỗi hàng là một mảng con có columnValue cột, và mỗi ô trong mảng này được khởi tạo với giá trị false. */

    var directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    /*directions là một mảng chứa 4 mảng con.
    Mỗi mảng con có 2 phần tử, đại diện cho một cặp giá trị [x, y].*/
    /*Các cặp giá trị này có thể được dùng để biểu thị các hướng di chuyển trên lưới hoặc trong mê cung.
    Cụ thể:
    [0, 1]: Di chuyển sang phải (x không đổi, y tăng lên 1).
    [1, 0]: Di chuyển xuống dưới (x tăng lên 1, y không đổi).
    [0, -1]: Di chuyển sang trái (x không đổi, y giảm xuống 1).
    [-1, 0]: Di chuyển lên trên (x giảm xuống 1, y không đổi). */

    function isValid(x, y) {
        return x >= 0 && x < rowValue && y >= 0 && y < columnValue;
    }

    let wall_count = 0;


    // dfs tạo tường
    function dfs(x, y) {
        visited[x][y] = true;
        directions.sort(() => Math.random() - 0.5);
        for (var [dx, dy] of directions) {
            var nx = x + 2 * dx;
            var ny = y + 2 * dy;
            if (isValid(nx, ny) && !visited[nx][ny]) {
                // gán giá trị 1 tạo tường
                maze[x + dx][y + dy] = 1;
                maze[nx][ny] = 1;
                dfs(nx, ny);
            }
        }
    }

    // tạo tọa độ ngẫu nhiên x, y (hàng, cột)
    function getRandomCoordinate() {
        return [Math.floor(Math.random() * rowValue), Math.floor(Math.random() * columnValue)];
    }

    // tạo điểm bắt đầu, điểm kết thúc ngẫu nhiên
    var start, end;
    do {
        start = getRandomCoordinate();
        end = getRandomCoordinate();
    } while (start[0] === end[0] && start[1] === end[1]);

    // dfs tạo tường từ điểm khởi đầu start
    dfs(start[0], start[1]);


    // Ngẫu nhiên hóa tường
    var randomWallRemovalCount = Math.floor(rowValue * columnValue * 0.15);
    var wallRemoveCount = 0;
    for (var i = 0; i < randomWallRemovalCount; i++) {
        var randomX = Math.floor(Math.random() * rowValue);
        var randomY = Math.floor(Math.random() * columnValue);
        // nếu ô là tường, thì biến ô thành đường đi, theo số lượng được lấy từ biến randomWallRemovalCount
        if (maze[randomX][randomY] === 0) {
            maze[randomX][randomY] = 1;
            wallRemoveCount++;
        }
    }
    document.getElementById('wall-remove-count').textContent = wallRemoveCount;


    maze[start[0]][start[1]] = 2; // Điểm bắt đầu
    maze[end[0]][end[1]] = 3; // Điểm kết thúc


    wall_count = 0;
    // đếm các ô tường trong mê cung
    for (let i = 0; i < maze.length; i++) { // Duyệt qua các hàng
        for (let j = 0; j < maze[i].length; j++) { // Duyệt qua các cột trong mỗi hàng
            if (maze[i][j] == 0) {
                wall_count++;
            }
        }
    }

    // hiển thị giá trị của các biến đếm sang html
    document.getElementById('wall-count').textContent = wall_count;




    // Render mê cung
    for (var i = 0; i < rowValue; i++) {
        for (var j = 0; j < columnValue; j++) {
            var cell = document.createElement('div');
            var span_HeuristicH = document.createElement('span');
            var span_Phancach = document.createElement('span');
            var span_ChiphiG = document.createElement('span');

            // Gán giá trị id cho phần tử span
            span_HeuristicH.id = 'hid';
            span_Phancach.id = 'phancach';
            span_ChiphiG.id = 'gid';

            /* // Thêm nội dung cho phần tử span (tùy chọn)
            span_HeuristicH.textContent = 0;
            span_Phancach.textContent = '+';
            span_ChiphiG.textContent = 0; */



            switch (maze[i][j]) {
                case 1:
                    cell.className = 'item';
                    break;
                case 2:
                    cell.className = 'start';
                    break;
                case 3:
                    cell.className = 'end';
                    break;
                default:
                    cell.className = 'wall';
                    break;
            }
            container.appendChild(cell);
            // Thêm phần tử span vào tài liệu HTML
            if (maze[i][j] == 1) {
                cell.appendChild(span_HeuristicH);
                cell.appendChild(span_Phancach);
                cell.appendChild(span_ChiphiG);
            }
            /* document.getElementById('wall-count').textContent = wall_count; */
        }
    }

    // Lưu trữ mê cung, start và end để sử dụng trong A*
    window.maze = maze;
    window.start = start;
    window.end = end;
});

// hàm xử lý sự kiện click button find-path-button
// nếu maze đã được gender và gán giá trị cho thuộc tính của window thì gọi thuật toán A* để giải
document.getElementById('find-path-button').addEventListener('click', function () {
    if (window.maze && window.start && window.end) {
        console.log('Starting A* algorithm with:', { start: window.start, end: window.end });
        aStar(window.start, window.end);
    } else {
        alert("Please create the maze first!");
    }
});

async function aStar(start, end) {
    // mảng 1 chiều diections chứa các giá trị di chuyển trên mảng 2 chiều
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    // hàm heuristic
    // Hàm này tính toán khoảng cách Manhattan giữa hai điểm a và b trong không gian hai chiều
    function heuristic(a, b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }

    function isValid(x, y) {
        return x >= 0 && x < window.maze.length && y >= 0 && y < window.maze[0].length;
    }

    const openList = [];
    const closedList = [];
    const cameFrom = new Map();
    const gScore = Array.from({ length: window.maze.length }, () => Array(window.maze[0].length).fill(Infinity));
    const fScore = Array.from({ length: window.maze.length }, () => Array(window.maze[0].length).fill(Infinity));

    // thêm start vào openList
    openList.push(start);
    // thiết lập g() và h() đồng thời thiết lập f()
    gScore[start[0]][start[1]] = 0;
    fScore[start[0]][start[1]] = heuristic(start, end);

    // biến đếm số vòng lặp
    var loop_count = 0;
    var current;

    while (openList.length > 0) {
        // tìm phần tử có giá trị fScore nhỏ nhất trong mảng openList
        // sử dụng phương thức reduce() của mảng để so sánh các phần tử và trả về phần tử có giá trị fScore nhỏ nhất.
        current = openList.reduce((a, b) => (fScore[a[0]][a[1]] < fScore[b[0]][b[1]] ? a : b));

        // kiểm tra xem ô hiện tại có là ô end hay không
        // nếu là ô end thì tái tạo lại đường đi từ start đến end
        if (current[0] === end[0] && current[1] === end[1]) {
            reconstructPath(cameFrom, current);
            // Cập nhật số lượng ô trong danh sách đóng
            document.getElementById('closed-count').textContent = closedList.length;
            return;
        }

        // index của current trong openList và gán vào index
        const index = openList.indexOf(current);
        // xóa 1 phần tử từ vị trí index trong openList (xóa current trong openList)
        openList.splice(index, 1);
        // thêm 1 phần tử vào closedList (thêm current vừa xóa từ openList)
        closedList.push(current);

        // Thay đổi màu nền của ô trong danh sách đóng, (các ô đã đi qua)
        // chọn tất cả thẻ div là con của class container
        const cells = document.querySelectorAll('.container > div');
        // lấy vị trí của ô vừa đóng = vị trí hàng * số phần tử của hàng + vị trí cột
        const closedIndex = current[0] * window.maze[0].length + current[1];
        // nếu ô tồn tại, thay đổi ô sang màu hồng
        if (cells[closedIndex]) {
            cells[closedIndex].style.backgroundColor = 'pink'; // Thay đổi màu nền
        }

        // duyệt qua các ô lân cận của ô hiện tại current
        // duyệt qua từng cặp giá trị (phần tử) trong mảng directions
        for (const [dx, dy] of directions) {
            // tọa độ ô lân cận (neighbor) từ tọa độ current và giá trị direction
            const neighbor = [current[0] + dx, current[1] + dy];

            // kiểm tra tính hợp lệ của ô lân cận
            // kiểm tra ô lân cận có nằm trong danh sách đóng closeList hay không
            // kiểm tra ô lân cận có phải là wall (tường) không
            if (!isValid(neighbor[0], neighbor[1]) || closedList.some(n => n[0] === neighbor[0] && n[1] === neighbor[1]) || window.maze[neighbor[0]][neighbor[1]] === 0) {
                // nếu 1 trong 3 điều kiện là true, thì bỏ qua ô lân cận này, và sang ô lân cận tiếp theo
                continue;
            }

            // tính toán giá trị gScore tạm thời
            const tentative_gScore = gScore[current[0]][current[1]] + 1;

            // kiểm tra và cập nhật danh sách mở openList
            if (!openList.some(n => n[0] === neighbor[0] && n[1] === neighbor[1])) {
                openList.push(neighbor);
            } else if (tentative_gScore >= gScore[neighbor[0]][neighbor[1]]) {
                continue;
            }

            // cập nhật giá trị liên quan đến ô lân cận
            // cập nhật bản đồ cameFrom
            cameFrom.set(`${neighbor[0]},${neighbor[1]}`, current);
            // cập nhật gScore cho neighbor từ tentative_gScore
            gScore[neighbor[0]][neighbor[1]] = tentative_gScore;
            // cập nhật fScore cho neighbor từ gScore và heuristic từ neighbor đến end
            fScore[neighbor[0]][neighbor[1]] = gScore[neighbor[0]][neighbor[1]] + heuristic(neighbor, end);

            loop_count++;

            const neighborIndex = neighbor[0] * window.maze[0].length + neighbor[1];
            if (cells[neighborIndex]) {
                const h_span = cells[neighborIndex].querySelector('#hid');
                const g_span = cells[neighborIndex].querySelector('#gid');
                if (h_span) {
                    h_span.textContent = heuristic(neighbor, end);
                }
                else
                {
                    if (current[0] === end[0] && current[1] === end[1]) {
                        reconstructPath(cameFrom, current);
                        // Cập nhật số lượng ô trong danh sách đóng
                        document.getElementById('closed-count').textContent = closedList.length;
                        return;
                    }
                }
                if (g_span) {
                    g_span.textContent = gScore[neighbor[0]][neighbor[1]];
                }
                else
                {
                    if (current[0] === end[0] && current[1] === end[1]) {
                        reconstructPath(cameFrom, current);
                        // Cập nhật số lượng ô trong danh sách đóng
                        document.getElementById('closed-count').textContent = closedList.length;
                        return;
                    }
                }
            }
        }
        await waitForEvent();
    }
    alert("No path found!");
}

function waitForEvent() {
    return new Promise((resolve) => {
        // Giả sử bạn muốn chờ sự kiện click của một button
        document.getElementById('myButton').addEventListener('click', () => {
            resolve(); // Sự kiện được đáp ứng, tiếp tục vòng lặp
        });
    });
}


function reconstructPath(cameFrom, current) {
    const path = [];
    while (cameFrom.has(`${current[0]},${current[1]}`)) {
        path.push(current);
        current = cameFrom.get(`${current[0]},${current[1]}`);
    }
    path.push(current);
    path.reverse();

    console.log('Path found:', path);

    // Hiển thị đường đi trên giao diện
    const cells = document.querySelectorAll('.container > div');
    for (const [x, y] of path) {
        const index = x * window.maze[0].length + y;
        if (cells[index]) {
            cells[index].classList.add('path'); // Thêm class 'path' để tô màu xanh dương
            cells[index].style.backgroundColor = 'rgb(66, 66, 255)'; // Thay đổi màu nền
        }
    }

    // Cập nhật số lượng ô của đường đi
    document.getElementById('path-count').textContent = path.length - 1;
}


