const questionStages = [
  {
    id: 'childhood',
    label: 'Childhood',
    zh: '童年',
    questions: [
      {
        zh: '你今天乖不乖？',
        en: 'Have you been a good girl today?',
        images: {
          en: 'assets/childhood-strips/IMG_3783.png',
          zh: 'assets/childhood-strips/IMG_3784.png',
        },
      },
      {
        zh: '这次考试在班里排第几？',
        en: 'Where did you rank in your class this time?',
        images: {
          en: 'assets/childhood-strips/IMG_3779.png',
          zh: 'assets/childhood-strips/IMG_3780.png',
        },
      },
      {
        zh: '别人都会了，你怎么还不会？',
        en: 'Everyone else can do it. Why can’t you?',
        images: {
          en: 'assets/childhood-strips/IMG_3795.png',
          zh: 'assets/childhood-strips/IMG_3796.png',
        },
      },
      {
        zh: '女孩子是不是应该安静一点？',
        en: 'Shouldn’t a girl be a little quieter?',
        images: {
          en: 'assets/childhood-strips/IMG_3793.png',
          zh: 'assets/childhood-strips/IMG_3794.png',
        },
      },
      {
        zh: '你怎么又把裙子弄脏了？',
        en: 'How did you get your dress dirty again?',
        images: {
          en: 'assets/childhood-strips/IMG_3789.png',
          zh: 'assets/childhood-strips/IMG_3790.png',
        },
      },
      {
        zh: '你是姐姐，让着弟弟不行吗？',
        en: 'You’re his older sister. Can’t you let him have his way?',
        images: {
          en: 'assets/childhood-strips/IMG_3785.png',
          zh: 'assets/childhood-strips/IMG_3786.png',
        },
      },
      {
        zh: '见到长辈，怎么不知道叫人？',
        en: 'Why haven’t you greeted your elders?',
        images: {
          en: 'assets/childhood-strips/IMG_3769.png',
          zh: 'assets/childhood-strips/IMG_3770.png',
        },
      },
      {
        zh: '让亲戚抱一下，怎么还不愿意？',
        en: 'Why won’t you let your relative give you a hug?',
        images: {
          en: 'assets/childhood-strips/IMG_3791.png',
          zh: 'assets/childhood-strips/IMG_3792.png',
        },
      },
      {
        zh: '你怎么总玩男孩子的玩具？',
        en: 'Why do you always play with boys’ toys?',
        images: {
          en: 'assets/childhood-strips/IMG_3781.png',
          zh: 'assets/childhood-strips/IMG_3782.png',
        },
      },
      {
        zh: '学钢琴不好吗，为什么非要踢球？',
        en: 'What’s wrong with learning piano? Why do you insist on football?',
        images: {
          en: 'assets/childhood-strips/IMG_3767.png',
          zh: 'assets/childhood-strips/IMG_3768.png',
        },
      },
      {
        zh: '作业写完了吗，就想着玩？',
        en: 'Have you finished your homework, or are you already thinking about playing?',
        images: {
          en: 'assets/childhood-strips/IMG_3787.png',
          zh: 'assets/childhood-strips/IMG_3788.png',
        },
      },
      {
        zh: '你看别人家的孩子，怎么那么省心？',
        en: 'Why can’t you be as easy to raise as other people’s children?',
        images: {
          en: 'assets/childhood-strips/IMG_3777.png',
          zh: 'assets/childhood-strips/IMG_3778.png',
        },
      },
      {
        zh: '女孩子不是应该更细心吗？',
        en: 'Aren’t girls supposed to be more careful?',
        images: {
          en: 'assets/childhood-strips/IMG_3799.png',
          zh: 'assets/childhood-strips/IMG_3800.png',
        },
      },
      {
        zh: '妈妈这么辛苦，你怎么还不懂事？',
        en: 'Your mum works so hard. Why can’t you be more considerate?',
        images: {
          en: 'assets/childhood-strips/IMG_3803.png',
          zh: 'assets/childhood-strips/IMG_3804.png',
        },
      },
      {
        zh: '为什么不帮妈妈做家务？',
        en: 'Why aren’t you helping your mum with the housework?',
        images: {
          en: 'assets/childhood-strips/IMG_3801.png',
          zh: 'assets/childhood-strips/IMG_3802.png',
        },
      },
      {
        zh: '你怎么又哭了，这有什么好哭的？',
        en: 'Why are you crying again? What is there to cry about?',
        images: {
          en: 'assets/childhood-strips/IMG_3797.png',
          zh: 'assets/childhood-strips/IMG_3798.png',
        },
      },
      {
        zh: '老师说你爱说话，你就不能忍一忍吗？',
        en: 'Your teacher says you talk too much. Can’t you hold it in?',
        images: {
          en: 'assets/childhood-strips/IMG_3772.png',
          zh: 'assets/childhood-strips/IMG_3771.png',
        },
      },
      {
        zh: '你长大以后，要怎么报答爸爸妈妈？',
        en: 'How will you repay your parents when you grow up?',
        images: {
          en: 'assets/childhood-strips/IMG_3775.png',
          zh: 'assets/childhood-strips/IMG_3776.png',
        },
      },
      {
        zh: '这么多兴趣班，哪一个是你最拿得出手的？',
        en: 'With all those classes, what are you good enough at to show people?',
        images: {
          en: 'assets/childhood-strips/IMG_3765.png',
          zh: 'assets/childhood-strips/IMG_3766.png',
        },
      },
      {
        zh: '我们都是为你好，你为什么不听？',
        en: 'We only want what’s best for you. Why won’t you listen?',
        images: {
          en: 'assets/childhood-strips/IMG_3773.png',
          zh: 'assets/childhood-strips/IMG_3774.png',
        },
      },
    ],
  },
  {
    id: 'adolescence',
    label: 'Adolescence',
    zh: '青春期',
    questions: [
      {
        zh: '女孩子到了高中，理科还能跟得上吗？',
        en: 'Can girls still keep up in science once they reach high school?',
      },
      {
        zh: '成绩这么好，怎么偏偏要学艺术？',
        en: 'With grades like yours, why would you choose art?',
      },
      {
        zh: '你现在不拼，以后怎么考上好大学？',
        en: 'If you don’t push yourself now, how will you get into a good university?',
      },
      {
        zh: '都这个年纪了，怎么还不知道打扮？',
        en: 'At your age, shouldn’t you start making an effort with your appearance?',
      },
      {
        zh: '你是来上学的，还是来打扮的？',
        en: 'Are you here to study or to show off your looks?',
      },
      {
        zh: '你是不是又胖了？',
        en: 'Have you put on weight again?',
      },
      {
        zh: '女孩子吃这么多干什么？',
        en: 'Why does a girl need to eat so much?',
      },
      {
        zh: '穿这么短，你不怕别人议论吗？',
        en: 'Aren’t you worried about what people will say if you wear something that short?',
      },
      {
        zh: '女孩子坐着能不能规矩一点？',
        en: 'Can’t you sit properly, like a young lady?',
      },
      {
        zh: '你怎么晒得这么黑？',
        en: 'Why have you let yourself get so tanned?',
      },
      {
        zh: '你跟那个男生到底是什么关系？',
        en: 'What exactly is going on between you and that boy?',
      },
      {
        zh: '你怎么能喜欢女孩子？',
        en: 'How can you be attracted to girls?',
      },
      {
        zh: '手机有什么不能让爸妈看的？',
        en: 'What’s on your phone that your parents aren’t allowed to see?',
      },
      {
        zh: '晚上出去，女孩子怎么能这么晚回家？',
        en: 'How can a girl stay out this late?',
      },
      {
        zh: '他为什么只招惹你，不招惹别人？',
        en: 'Why does he pick on you and not anyone else?',
      },
      {
        zh: '有什么委屈不能忍一忍，非要闹大？',
        en: 'Can’t you put up with it instead of making a scene?',
      },
      {
        zh: '女孩子读师范不是更稳妥吗？',
        en: 'Wouldn’t teacher training be a safer choice for a girl?',
      },
      {
        zh: '上大学非要去那么远吗？',
        en: 'Do you really have to go so far away for university?',
      },
      {
        zh: '你这么要强，以后谁受得了你？',
        en: 'If you’re this strong-willed, who will put up with you?',
      },
      {
        zh: '你现在的任务就是学习，想那么多干什么？',
        en: 'Your only job right now is to study. Why are you thinking about anything else?',
      },
    ],
  },
  {
    id: 'womanhood',
    label: 'Womanhood',
    zh: '成年期',
    questions: [
      {
        zh: '工作再好，不结婚有什么用？',
        en: 'What’s the point of a great career if you don’t get married?',
      },
      {
        zh: '你是不是眼光太高了？',
        en: 'Are your standards too high?',
      },
      {
        zh: '你读这么多书，会不会更难找对象？',
        en: 'Won’t all that education make it harder to find a partner?',
      },
      {
        zh: '一定要买自己的房子吗，以后不是要嫁人？',
        en: 'Why buy your own home if you’re going to get married anyway?',
      },
      {
        zh: '为什么不找一份离家近的稳定工作？',
        en: 'Why not find a stable job closer to home?',
      },
      {
        zh: '面试时问你婚育计划，不是很正常吗？',
        en: 'Isn’t it normal for an interviewer to ask about your plans for marriage and children?',
      },
      {
        zh: '你这么忙，怎么照顾家庭？',
        en: 'If you’re this busy, how will you take care of a family?',
      },
      {
        zh: '你挣得比他多，不怕他没面子吗？',
        en: 'Aren’t you worried he’ll lose face if you earn more than he does?',
      },
      {
        zh: '结了婚还分什么你的、他的？',
        en: 'Now that you’re married, why keep talking about what’s yours and what’s his?',
      },
      {
        zh: '过年为什么不能一直在男方家过？',
        en: 'Why can’t you spend every Lunar New Year with your husband’s family?',
      },
      {
        zh: '不生孩子，你以后不会后悔吗？',
        en: 'Won’t you regret it later if you don’t have children?',
      },
      {
        zh: '都生了一个了，为什么不再生一个？',
        en: 'You’ve already had one. Why not have another?',
      },
      {
        zh: '生了女儿，还不打算要个儿子吗？',
        en: 'You’ve had a daughter. Aren’t you going to try for a son?',
      },
      {
        zh: '孩子这么小，你怎么放心去上班？',
        en: 'How can you go back to work when your child is still so little?',
      },
      {
        zh: '你怎么又为了孩子请假？',
        en: 'Why are you taking time off for your child again?',
      },
      {
        zh: '他都帮你带孩子了，你还有什么不满意？',
        en: 'He even helps you look after the children. What more do you want?',
      },
      {
        zh: '家里这么乱，你平时都在忙什么？',
        en: 'What do you do all day if the house is this messy?',
      },
      {
        zh: '父母年纪大了，你怎么还只顾自己的生活？',
        en: 'Your parents are getting older. How can you still put your own life first?',
      },
      {
        zh: '为了孩子，就不能再忍一忍吗？',
        en: 'Can’t you put up with it a little longer, for the children?',
      },
      {
        zh: '这个年纪重新开始，会不会太晚了？',
        en: 'Isn’t it too late to start over at your age?',
      },
    ],
  },
  {
    id: 'later-life',
    label: 'Later life',
    zh: '晚年',
    questions: [
      {
        zh: '都退休了，怎么还这么忙自己的事？',
        en: 'You’re retired now. Why are you still so busy with your own interests?',
      },
      {
        zh: '你不帮忙带孙辈，孩子们怎么上班？',
        en: 'If you don’t look after the grandchildren, how will your children go to work?',
      },
      {
        zh: '带自己的孙辈，有什么好抱怨的？',
        en: 'They’re your own grandchildren. What is there to complain about?',
      },
      {
        zh: '你一个人在家，怎么还会没空？',
        en: 'You’re home on your own. How can you possibly be busy?',
      },
      {
        zh: '这把年纪了，还穿这么鲜艳？',
        en: 'At your age, why are you still wearing such bright colours?',
      },
      {
        zh: '都当奶奶了，还打扮给谁看？',
        en: 'You’re a grandmother now. Who are you dressing up for?',
      },
      {
        zh: '你怎么不把白头发染一染？',
        en: 'Why don’t you dye your grey hair?',
      },
      {
        zh: '这么大年纪了，还谈什么恋爱？',
        en: 'At your age, why are you still thinking about romance?',
      },
      {
        zh: '你再婚，有没有替子女想过？',
        en: 'Have you thought about your children before deciding to remarry?',
      },
      {
        zh: '一个人住不孤单吗，为什么不搬去和孩子住？',
        en: 'Aren’t you lonely living alone? Why not move in with your children?',
      },
      {
        zh: '家里又不是没人，为什么要去养老院？',
        en: 'Why move into a care home when you have family?',
      },
      {
        zh: '不舒服就忍忍，何必让孩子担心？',
        en: 'Can’t you put up with feeling unwell instead of worrying your children?',
      },
      {
        zh: '你是不是应该少麻烦孩子一点？',
        en: 'Shouldn’t you try to be less of a burden on your children?',
      },
      {
        zh: '这些事情你又不懂，为什么还要自己决定？',
        en: 'Why insist on deciding for yourself when you don’t understand these things?',
      },
      {
        zh: '养老金为什么不留着给孩子？',
        en: 'Why not save your pension for your children?',
      },
      {
        zh: '这个手机教了这么多遍，你怎么还不会？',
        en: 'We’ve shown you how to use this phone so many times. Why haven’t you learnt?',
      },
      {
        zh: '年纪大了，就不能少说两句吗？',
        en: 'Now that you’re older, can’t you keep your opinions to yourself?',
      },
      {
        zh: '你现在才想去学，会不会太晚了？',
        en: 'Isn’t it too late to start learning that now?',
      },
      {
        zh: '都这把年纪了，还有什么不知足的？',
        en: 'At your age, what more could you possibly want?',
      },
      {
        zh: '为家里操心了一辈子，现在怎么反而想走了？',
        en: 'After spending your whole life caring for this family, why do you want to leave now?',
      },
    ],
  },
];
