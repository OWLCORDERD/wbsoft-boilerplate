<template>
    <div class="today-memory">
        <div class="today-memory-header">
            <div class="title-wrap">
                <h1 class="title">Today's memory</h1>
                <p class="description">오늘 하루 있었던 이슈 사항이나 공부한 내용들을 저장합니다.</p>
            </div>
            <button type="button" class="register-button" title="메모리 작성 버튼" @click="registMemory">작성하기</button>
        </div>

        <div class="today-memory-contents">
            <ul class="today-memory-contents-list">
                <li class="contents-item" v-for="item in example">
                    <dl class="contents-item-index">
                        <dt class="date">{{ item.date }}</dt>
                        <dd class="index-title">{{ item.title }}</dd>
                    </dl>

                    <div class="contents-item-description">
                        <span>{{ item.text }}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts" setup>
    const router = useRouter();

    const example = ref([
        {
            id : 1,
            date: "2024.09.16",
            title: "실무 프로젝트 스크롤 이벤트를 GSAP ScrollTrigger로 개선한 사례",
            text: "기존 회사 실무 프로젝트에서는 window 내장 객체에 있는 scrollY 값을 이용하여 모바일, PC 해상도에 따라 스크롤 이벤트 지점을 정하였고, 인라인 스타일 ..."
        },
        {
            id : 2,
            date: "2024.09.16",
            title: "실무 프로젝트 스크롤 이벤트를 GSAP ScrollTrigger로 개선한 사례",
            text: "기존 회사 실무 프로젝트에서는 window 내장 객체에 있는 scrollY 값을 이용하여 모바일, PC 해상도에 따라 스크롤 이벤트 지점을 정하였고, 인라인 스타일 ..."
        },
        {
            id : 3,
            date: "2024.09.16",
            title: "실무 프로젝트 스크롤 이벤트를 GSAP ScrollTrigger로 개선한 사례",
            text: "기존 회사 실무 프로젝트에서는 window 내장 객체에 있는 scrollY 값을 이용하여 모바일, PC 해상도에 따라 스크롤 이벤트 지점을 정하였고, 인라인 스타일 ..."
        },
        {
            id : 4,
            date: "2024.09.16",
            title: "실무 프로젝트 스크롤 이벤트를 GSAP ScrollTrigger로 개선한 사례",
            text: "기존 회사 실무 프로젝트에서는 window 내장 객체에 있는 scrollY 값을 이용하여 모바일, PC 해상도에 따라 스크롤 이벤트 지점을 정하였고, 인라인 스타일 ..."
        },
        {
            id : 5,
            date: "2024.09.16",
            title: "실무 프로젝트 스크롤 이벤트를 GSAP ScrollTrigger로 개선한 사례",
            text: "기존 회사 실무 프로젝트에서는 window 내장 객체에 있는 scrollY 값을 이용하여 모바일, PC 해상도에 따라 스크롤 이벤트 지점을 정하였고, 인라인 스타일 ..."
        }
    ])

    const registMemory = () => {
        router.push("regist-memo/0");
    }
</script>
<style lang="scss">
    .today-memory {
        width: 920px;

        &-header {
            position: relative;
            width: 100%;
            height: 150px;

            .title-wrap {
                width: 70%;
                height: 100%;

                .title {
                    width: 100%;
                    height: 80px;
                    line-height: 80px;
                    font-family: "Paper_B";
                    font-size: var(--font-xl);
                    text-transform: uppercase;
                }

                .description {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    font-family: "Paper_M";
                    font-size: var(--font-l);
                    margin-top: 30px;
                }
            }

            .register-button {
                position: absolute;
                right: 0;
                top: 30px;
                display: block;
                width: 150px;
                height: 50px;
                background-color: var(--check_color);
                border: none;
                color: #fff;
                font-family: "Paper_B";
                font-size: var(--font-l);
                letter-spacing: 0.05em;
                cursor: pointer;
                @include transition;

                &:hover {
                    background-color: transparent;
                    border: 2px solid var(--check_color);
                    color: var(--check_color);
                }
            }
        }

        &-contents {
            width: 100%;
            padding: 50px 0;

            &-list {
                width: 100%;
                height: max-content;

                .contents-item {
                    width: 100%;
                    height: 100%;
                    margin: 50px 0;

                    &-index {
                        width: 100%;
                        height: 120px;

                        .date {
                            height: 20px;
                            font-family: "Paper_B";
                            font-size: var(--font-m);
                            color: var(--txt_color);
                        }

                        .index-title {
                            height: 80px;
                            margin-top: 20px;
                            line-height: 80px;
                            font-family: "Paper_B";
                            font-size: var(--font-xl);
                        }
                    }

                    &-description {
                        height: 130px;
                        margin-top: 20px;
                        padding: 20px 30px;
                        background-color: var(--input_background);

                        span {
                            font-family: "Paper_M";
                            color: var(--txt_color);
                            font-size: var(--font-l);
                        }
                    }
                }
            }
        }
    }
</style>