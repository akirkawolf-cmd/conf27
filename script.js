 function getUsers() {
            return JSON.parse(localStorage.getItem('conf_users') || '[]');
        }

        function saveUsers(users) {
            localStorage.setItem('conf_users', JSON.stringify(users));
        }

        function getRequests() {
            return JSON.parse(localStorage.getItem('conf_requests') || '[]');
        }

        function saveRequests(requests) {
            localStorage.setItem('conf_requests', JSON.stringify(requests));
        }

        function getCurrentUser() {
            return JSON.parse(localStorage.getItem('conf_currentUser') || 'null');
        }

        function setCurrentUser(user) {
            localStorage.setItem('conf_currentUser', JSON.stringify(user));
        }

        function clearCurrentUser() {
            localStorage.removeItem('conf_currentUser');
        }

        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');

            const header = document.getElementById('mainHeader');
            if (pageId === 'pageRegister' || pageId === 'pageLogin') {
                header.style.display = 'none';
            } else {
                header.style.display = 'flex';
            }

            document.querySelectorAll('.alert').forEach(a => a.classList.remove('show'));
            document.querySelectorAll('.error-msg').forEach(e => e.style.display = 'none');
            document.querySelectorAll('input.invalid').forEach(i => i.classList.remove('invalid'));
        }

        function switchUserTab(tab, btn) {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            if (tab === 'myRequests') {
                document.getElementById('tabMyRequests').style.display = 'block';
                document.getElementById('tabNewRequest').style.display = 'none';
                renderUserRequests();
            } else {
                document.getElementById('tabMyRequests').style.display = 'none';
                document.getElementById('tabNewRequest').style.display = 'block';
            }
        }


        function registerUser() {
            const login = document.getElementById('regLogin').value.trim();
            const password = document.getElementById('regPassword').value;
            const name = document.getElementById('regName').value.trim();
            const phone = document.getElementById('regPhone').value.trim();
            const email = document.getElementById('regEmail').value.trim();

            let valid = true;

            const loginRegex = /^[a-zA-Z0-9]{6,}$/;
            if (!loginRegex.test(login)) {
                document.getElementById('regLogin').classList.add('invalid');
                document.getElementById('regLoginError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('regLogin').classList.remove('invalid');
                document.getElementById('regLoginError').style.display = 'none';
            }

            if (password.length < 8) {
                document.getElementById('regPassword').classList.add('invalid');
                document.getElementById('regPasswordError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('regPassword').classList.remove('invalid');
                document.getElementById('regPasswordError').style.display = 'none';
            }

            const nameRegex = /^[а-яА-ЯёЁ\s]+$/;
            if (!nameRegex.test(name) || name.length < 2) {
                document.getElementById('regName').classList.add('invalid');
                document.getElementById('regNameError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('regName').classList.remove('invalid');
                document.getElementById('regNameError').style.display = 'none';
            }

            const phoneRegex = /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(phone)) {
                document.getElementById('regPhone').classList.add('invalid');
                document.getElementById('regPhoneError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('regPhone').classList.remove('invalid');
                document.getElementById('regPhoneError').style.display = 'none';
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('regEmail').classList.add('invalid');
                document.getElementById('regEmailError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('regEmail').classList.remove('invalid');
                document.getElementById('regEmailError').style.display = 'none';
            }

            if (!valid) return;

            const users = getUsers();
            if (users.find(u => u.login === login)) {
                showAlert('regAlertError', 'Пользователь с таким логином уже существует');
                return;
            }

            users.push({ login, password, name, phone, email });
            saveUsers(users);

            showAlert('regAlertSuccess', 'Пользователь успешно создан! Теперь вы можете войти.');
            setTimeout(() => showPage('pageLogin'), 1500);
        }


        function loginUser() {
            const login = document.getElementById('loginLogin').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (login === 'Conf2027' && password === 'Demo77') {
                setCurrentUser({ login: 'Conf2027', name: 'Администратор', isAdmin: true });
                document.getElementById('headerUserName').textContent = 'Администратор';
                showPage('pageAdmin');
                renderAdminPanel();
                return;
            }

            const users = getUsers();
            const user = users.find(u => u.login === login && u.password === password);

            if (!user) {
                showAlert('loginAlertError', 'Неверный логин или пароль');
                return;
            }

            setCurrentUser({ login: user.login, name: user.name, isAdmin: false });
            document.getElementById('headerUserName').textContent = user.name;
            showPage('pageRequests');
            renderUserRequests();
        }

        function logout() {
            clearCurrentUser();
            document.getElementById('loginLogin').value = '';
            document.getElementById('loginPassword').value = '';
            showPage('pageLogin');
        }

        function submitRequest() {
            const room = document.getElementById('reqRoom').value;
            const roomName = document.getElementById('reqRoomName').value.trim();
            const date = document.getElementById('reqDate').value;
            const payment = document.querySelector('input[name="payment"]:checked');

            let valid = true;

            if (!room) {
                document.getElementById('reqRoom').classList.add('invalid');
                document.getElementById('reqRoomError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('reqRoom').classList.remove('invalid');
                document.getElementById('reqRoomError').style.display = 'none';
            }

            if (!roomName) {
                document.getElementById('reqRoomName').classList.add('invalid');
                document.getElementById('reqRoomNameError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('reqRoomName').classList.remove('invalid');
                document.getElementById('reqRoomNameError').style.display = 'none';
            }

            if (!date) {
                document.getElementById('reqDate').classList.add('invalid');
                document.getElementById('reqDateError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('reqDate').classList.remove('invalid');
                document.getElementById('reqDateError').style.display = 'none';
            }

            if (!payment) {
                document.getElementById('reqPaymentError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('reqPaymentError').style.display = 'none';
            }

            if (!valid) return;

            const user = getCurrentUser();
            const requests = getRequests();

            requests.push({
                id: Date.now(),
                userLogin: user.login,
                userName: user.name,
                room: room,
                roomName: roomName,
                date: date,
                payment: payment.value,
                status: 'Новая',
                feedback: ''
            });

            saveRequests(requests);

            showAlert('reqAlertSuccess', 'Заявка успешно отправлена на рассмотрение администратору!');

            document.getElementById('reqRoom').value = '';
            document.getElementById('reqRoomName').value = '';
            document.getElementById('reqDate').value = '';
            document.querySelectorAll('input[name="payment"]').forEach(r => r.checked = false);

            setTimeout(() => {
                document.getElementById('reqAlertSuccess').classList.remove('show');
            }, 3000);
        }

        function renderUserRequests() {
            const user = getCurrentUser();
            const requests = getRequests().filter(r => r.userLogin === user.login);
            const container = document.getElementById('requestsList');

            if (requests.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>У вас пока нет заявок</p></div>';
                return;
            }

            container.innerHTML = requests.map(req => `
                <div class="request-item">
                    <div class="req-header">
                        <h3>${req.room} — ${req.roomName}</h3>
                        <span class="status-badge ${getStatusClass(req.status)}">${req.status}</span>
                    </div>
                    <div class="req-details">
                        <strong>Дата:</strong> ${formatDate(req.date)}<br>
                        <strong>Оплата:</strong> ${req.payment}
                    </div>
                    <div class="feedback-section">
                        ${req.feedback
                            ? `<div class="feedback-text"><strong>Ваш отзыв:</strong> ${req.feedback}</div>`
                            : (req.status !== 'Новая' ? `
                                <textarea id="feedback_${req.id}" placeholder="Оставьте отзыв о проведённом мероприятии..."></textarea>
                                <button class="btn btn-primary" style="margin-top:8px;" onclick="saveFeedback(${req.id})">Сохранить отзыв</button>
                              ` : '<p style="font-size:0.85em;color:#999;margin-top:8px;">Отзыв можно оставить после изменения статуса заявки администратором</p>')
                        }
                    </div>
                </div>
            `).join('');
        }

        function saveFeedback(requestId) {
            const textarea = document.getElementById(`feedback_${requestId}`);
            const feedback = textarea.value.trim();

            if (!feedback) {
                alert('Введите текст отзыва');
                return;
            }

            const requests = getRequests();
            const req = requests.find(r => r.id === requestId);
            if (req) {
                req.feedback = feedback;
                saveRequests(requests);
                renderUserRequests();
            }
        }

        function renderAdminPanel() {
            const requests = getRequests();

            const newCount = requests.filter(r => r.status === 'Новая').length;
            const scheduledCount = requests.filter(r => r.status === 'Мероприятие назначено').length;
            const completedCount = requests.filter(r => r.status === 'Завершено').length;

            document.getElementById('adminStats').innerHTML = `
                <div class="stat-card">
                    <div class="stat-num">${newCount}</div>
                    <div class="stat-label">Новых</div>
                </div>
                <div class="stat-card">
                    <div class="stat-num">${scheduledCount}</div>
                    <div class="stat-label">Назначено</div>
                </div>
                <div class="stat-card">
                    <div class="stat-num">${completedCount}</div>
                    <div class="stat-label">Завершено</div>
                </div>
                <div class="stat-card">
                    <div class="stat-num">${requests.length}</div>
                    <div class="stat-label">Всего</div>
                </div>
            `;

            const container = document.getElementById('adminRequestsList');

            if (requests.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>Заявок пока нет</p></div>';
                return;
            }

            container.innerHTML = requests.map(req => `
                <div class="request-item">
                    <div class="req-header">
                        <h3>${req.room} — ${req.roomName}</h3>
                        <span class="status-badge ${getStatusClass(req.status)}">${req.status}</span>
                    </div>
                    <div class="req-details">
                        <strong>Пользователь:</strong> ${req.userName} (${req.userLogin})<br>
                        <strong>Дата:</strong> ${formatDate(req.date)}<br>
                        <strong>Оплата:</strong> ${req.payment}<br>
                        ${req.feedback ? `<strong>Отзыв:</strong> ${req.feedback}` : ''}
                    </div>
                    <div class="admin-actions">
                        <button class="btn btn-warning" onclick="changeStatus(${req.id}, 'Мероприятие назначено')">Мероприятие назначено</button>
                        <button class="btn btn-success" onclick="changeStatus(${req.id}, 'Завершено')">Завершено</button>
                    </div>
                </div>
            `).join('');
        }

        function changeStatus(requestId, newStatus) {
            const requests = getRequests();
            const req = requests.find(r => r.id === requestId);
            if (req) {
                req.status = newStatus;
                saveRequests(requests);
                renderAdminPanel();
            }
        }

        function showAlert(id, message) {
            const el = document.getElementById(id);
            el.textContent = message;
            el.classList.add('show');
            setTimeout(() => el.classList.remove('show'), 4000);
        }

        function getStatusClass(status) {
            switch (status) {
                case 'Новая': return 'status-new';
                case 'Мероприятие назначено': return 'status-scheduled';
                case 'Завершено': return 'status-completed';
                default: return '';
            }
        }

        function formatDate(dateStr) {
            if (!dateStr) return '';
            const parts = dateStr.split('-');
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }

        (function init() {
            const user = getCurrentUser();
            if (user) {
                document.getElementById('headerUserName').textContent = user.name;
                if (user.isAdmin) {
                    showPage('pageAdmin');
                    renderAdminPanel();
                } else {
                    showPage('pageRequests');
                    renderUserRequests();
                }
            } else {
                showPage('pageLogin');
            }
        })();