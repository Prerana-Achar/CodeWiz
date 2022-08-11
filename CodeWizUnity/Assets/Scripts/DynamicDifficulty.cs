using System;
using System.Diagnostics;
public class DynamicDifficulty
{
    public static int score;
    public static int currentDifficulty;
    public static void NextDifficulty(double time,int difficulty,int hints_taken)
    {
        /*int hints_taken = 2;*/

        int easy_weight = 0;
        int medium_weight = 1;
        int hard_weight = 2;
        int next_level = 3;
        int next_difficulty = 0;

        int easy = 1000;
        int medium = 5000;
        int hard = 10000;

        double score = 0D;

        while (next_difficulty != next_level)
        {
            if (difficulty == easy_weight && time > 500)
            {
                next_difficulty = easy_weight;
                difficulty = next_difficulty;
            }
            else if (difficulty == easy_weight && time <= 500)
            {
                score = (easy) - (time * 1.5) - (hints_taken) * 10;
                next_difficulty = medium_weight;
                difficulty = next_difficulty;
            }
            else if (difficulty == medium_weight && time > 750)
            {
                next_difficulty = easy_weight;
                difficulty = next_difficulty;
            }
            else if (difficulty == medium_weight && time <= 750)
            {
                score = (medium) - (time * 1.5) - (hints_taken) * 10;
                next_difficulty = hard_weight;
                difficulty = next_difficulty;
            }
            else if (difficulty == hard_weight && time > 1000)
            {
                next_difficulty = medium_weight;
                difficulty = next_difficulty;
            }
            else if (difficulty == hard_weight && time <= 1000)
            {
                score = (hard) - (time * 1.5) - (hints_taken) * 10;
                next_difficulty = next_level;
                difficulty = next_difficulty;
            }
        }
        
        /*Console.WriteLine(next_difficulty);
        Console.WriteLine(score);*/
    }
    public static Stopwatch timer=new Stopwatch();
    public static void startTimer()
    {
        timer.Reset();
        timer.Start();
    }
    public static long getTimeElapsed()
    {
        timer.Stop();
        return (long)(timer.ElapsedMilliseconds/1000);
    }

    public static int getinitialN(int levelNumber)
    {
        APIConnections.FetchLevel(APIConnections.currentUsername,levelNumber);
        int difficulty = 0;
        if (APIConnections.studentLevel.time[2].Length != 0)
            difficulty = 2;
        else if (APIConnections.studentLevel.time[1].Length != 0)
            difficulty = 1;
        else
            difficulty = 0;
        return difficulty;
    }

}