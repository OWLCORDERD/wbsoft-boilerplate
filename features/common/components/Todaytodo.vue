<template>
    <div class="today-todo">
        <div class="today-todo-title">
            <h1>안녕하세요, {{ username }} 님.</h1>
            <p>오늘의 일정을 추가하여 관리할 수 있습니다.</p>
        </div>

        <div class="today-todo-input">
            <input type="text" placeholder="일정을 추가해주세요." v-model="checkText"/>
            <button type="button" title="일정 추가 버튼" class="add_todo is_pointer" @click="addCheckList">추가</button>
        </div>
        
        <ul class="check-list">
            <li class="work" v-for="item in checkList" ref="workItem" v-if="checkList.length > 0">
                <span class="work-title is_pointer" @click="checkToggle(item.id)">{{ item.text }}</span>
            </li>
        </ul>
    </div>
</template>
<script setup>
    import { ref } from "vue";

    const username = ref("민혁");
    const checkText = ref('');
    const checkStatus = ref(false);
    const workItem = ref([]);
    const checkList = ref([]);
    const newSchedule = ref();

    const { data } = await useFetch('/api/checkList');

    const checkToggle = (id) => {
        if(workItem.value) {
            workItem.value[id -  1].classList.toggle("active");
        }
        checkStatus.value = !checkStatus.value;
    }

    const addCheckList = () => {
        // 디바운스 기법 활용 -> 마지막 검색어 추적
        setTimeout(() => {
            const addSchdule = {
                id : checkList.value.length + 1,
                text: checkText.value
            }

            newSchedule.value = addSchdule;
        }, 500)
    }

    watch(newSchedule, async() => {
        if(newSchedule !== undefined && checkText.value !== "") {
            await useFetch('/api/addSchedule', {
                method : "POST",
                body : {
                    newSchedule: newSchedule.value,
                },
            });

            const { data } = await useFetch('/api/checkList');

            checkList.value = data.value;
            checkText.value = ""
        } else {
            alert("일정을 입력해주세요.");
            return;
        }
    })

    onMounted(() => {
        checkList.value = data.value;
    })

</script>
<style lang="scss" scoped>
    .today-todo {
        width: 600px;
        &-title {
            height: 200px;
            h1 {
                font-size: 28px;
                font-family: "Paper_B";
                line-height: 100px;
                margin-bottom: 50px;
            }
            p {
                height: 50px;
                font-size: var(--font-xl);
                font-family: "Paper_M";
            }
        }

        &-input {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 50px;
            margin : 20px 0;
            
            input {
                @include size(calc(100% - 120px), 100%);
                padding: 0 10px;
                font-family: "Paper_M";
                border: 2px solid var(--input_background);
                
                &:focus {
                    outline : none;
                    border : 2px solid var(--check_color);
                }
            }
            .add_todo {
                display: block;
                background-color: var(--check_color);
                @include size(100px + 4px, 50px + 4px);
                margin-left: 10px;
                border: none;
                font-family: "Paper_B";
                font-size: var(--font-l);
                color: var(--sub_color);
                @include transition;

                &:hover {
                    background-color: transparent;
                    border: 2px solid var(--check_color);
                    color: var(--check_color);
                }
            }
        }
        .check-list {
            width: 100%;
            height: 100%;
            padding: 20px 0;

            .work {
                display: flex;
                align-items: center;
                width: 100%;
                height: 56px;

                &::before {
                    display: block;
                    content: '';
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--main_color);
                    margin-right: 20px;
                    @include transition;
                }

                &-title {
                    font-size: var(--font-m);
                    font-family: "Paper_B";
                    height: 24px;
                    line-height: 24px;
                }

                &.active{
                    &::before {
                        background-color: var(--check_color);
                    }

                    .work {
                        &-title {
                        color: var(--check_color);
                        text-decoration: line-through;
                        }
                    }
                }
            }
        }
    }
</style>